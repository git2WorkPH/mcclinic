"""Offline policy checks; no AWS clients or credential access."""
import unittest
from pathlib import Path
from cfnlint.decode import decode

ROOT = Path(__file__).resolve().parent

def template(name):
    data, errors = decode(str(ROOT / name))
    if errors:
        raise ValueError(errors)
    return data

class StagingPolicy(unittest.TestCase):
    def setUp(self):
        self.base = template('staging-foundation.yaml')
        self.edge = template('staging-edge-access.yaml')
        self.r = self.base['Resources']

    def test_private_encrypted_database_and_retained_storage(self):
        db = self.r['Database']['Properties']
        self.assertEqual(db['DBName'], 'mcclinic')
        self.assertFalse(db['PubliclyAccessible'])
        self.assertTrue(db['StorageEncrypted'])
        self.assertTrue(db['ManageMasterUserPassword'])
        self.assertTrue(db['DeletionProtection'])
        self.assertFalse(db['DeleteAutomatedBackups'])
        self.assertNotIn('MasterUserPassword', db)
        self.assertEqual(self.r['DatabaseParameters']['Properties']['Parameters']['rds.force_ssl'], '1')
        for name in ['Database', 'StorageKey', 'IdentityKey', 'Registry', 'WebAssets', 'ApiLogs']:
            self.assertEqual(self.r[name]['DeletionPolicy'], 'Retain', name)
            self.assertEqual(self.r[name]['UpdateReplacePolicy'], 'Retain', name)
        assets = self.r['WebAssets']['Properties']
        self.assertTrue(all(assets['PublicAccessBlockConfiguration'].values()))
        self.assertEqual(assets['VersioningConfiguration']['Status'], 'Enabled')
        self.assertNotIn('LifecycleConfiguration', assets)
        self.assertNotIn('LifecyclePolicy', self.r['Registry']['Properties'])

    def test_network_cannot_expose_runtime_or_database(self):
        for subnet in ['PrivateA', 'PrivateB']:
            self.assertFalse(self.r[subnet]['Properties']['MapPublicIpOnLaunch'])
        self.assertNotIn('SecurityGroupIngress', self.r['RuntimeGroup']['Properties'])
        rule = self.r['DatabaseGroup']['Properties']['SecurityGroupIngress']
        self.assertEqual(rule, [{'IpProtocol': 'tcp', 'FromPort': 5432, 'ToPort': 5432, 'SourceSecurityGroupId': {'Ref': 'RuntimeGroup'}}])
        self.assertFalse(any(r['Type'] in ['AWS::EC2::InternetGateway', 'AWS::EC2::NatGateway', 'AWS::ECS::Service'] for r in self.r.values()))
        endpoints = [r for r in self.r.values() if r['Type'] == 'AWS::EC2::VPCEndpoint']
        self.assertEqual(len(endpoints), 6)
        for endpoint in endpoints:
            p = endpoint['Properties']
            if p['VpcEndpointType'] == 'Interface':
                self.assertTrue(p['PrivateDnsEnabled'])
                self.assertEqual(p['SecurityGroupIds'], [{'Ref': 'EndpointGroup'}])
        for group in ['RuntimeGroup', 'DatabaseGroup', 'EndpointGroup']:
            for rule in self.r[group]['Properties'].get('SecurityGroupEgress', []):
                self.assertNotEqual(rule.get('CidrIp'), '0.0.0.0/0')

    def test_runtime_cannot_read_master_secret_or_manage_keys(self):
        statements = self.r['RuntimeRole']['Properties']['Policies'][0]['PolicyDocument']['Statement']
        self.assertEqual(len(statements), 1)
        self.assertEqual(statements[0]['Action'], 'kms:Decrypt')
        self.assertEqual(statements[0]['Resource'], {'Fn::GetAtt': ['IdentityKey', 'Arn']})
        self.assertEqual(statements[0]['Condition']['StringEquals']['kms:EncryptionContext:environment'], 'synthetic-staging')
        execution = self.r['ExecutionRole']['Properties']['Policies'][0]['PolicyDocument']['Statement']
        reads = [s for s in execution if s['Action'] == 'secretsmanager:GetSecretValue']
        self.assertEqual(reads[0]['Resource'], {'Ref': 'RuntimeDatabaseSecretArn'})
        self.assertNotIn('MasterUserSecret', str(self.base['Outputs']))
        for s in execution:
            if s['Resource'] == '*':
                self.assertEqual(s['Action'], 'ecr:GetAuthorizationToken')

    def test_budget_requires_owner_input_and_sends_no_email_subscriptions(self):
        self.assertNotIn('Default', self.base['Parameters']['MonthlyBudgetUsd'])
        notifications = self.r['Budget']['Properties']['NotificationsWithSubscribers']
        self.assertEqual([n['Notification']['Threshold'] for n in notifications], [50, 80, 100])
        self.assertFalse(any(r['Type'] == 'AWS::SNS::Subscription' for r in self.r.values()))
        self.assertEqual(self.base['Rules']['SingaporeOnly']['Assertions'][0]['Assert'], {'Fn::Equals': [{'Ref': 'AWS::Region'}, 'ap-southeast-1']})

    def test_edge_denies_unlisted_visitors_and_avoids_request_payload_sampling(self):
        p = self.edge['Parameters']['TesterCidrs']
        self.assertNotIn('Default', p)
        import re
        self.assertIsNone(re.fullmatch(p['AllowedPattern'], '0.0.0.0/0'))
        self.assertIsNotNone(re.fullmatch(p['AllowedPattern'], '203.0.113.10/32'))
        acl = self.edge['Resources']['WebAcl']['Properties']
        self.assertEqual(acl['DefaultAction'], {'Block': {}})
        self.assertFalse(acl['VisibilityConfig']['SampledRequestsEnabled'])
        self.assertEqual(acl['Rules'][0]['Action'], {'Block': {}})
        self.assertEqual(acl['Rules'][1]['Statement'], {'IPSetReferenceStatement': {'Arn': {'Fn::GetAtt': ['Testers', 'Arn']}}})
        self.assertTrue(all(not rule['VisibilityConfig']['SampledRequestsEnabled'] for rule in acl['Rules']))

if __name__ == '__main__':
    unittest.main(verbosity=2)
