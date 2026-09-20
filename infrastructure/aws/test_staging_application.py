"""Offline application-stack invariants; no AWS client calls."""
import unittest
from test_staging_policy import template

class ApplicationPolicy(unittest.TestCase):
    def setUp(self):
        self.app = template('staging-application.yaml')
        self.r = self.app['Resources']
        self.jobs = template('staging-database-jobs.yaml')

    def test_origin_and_private_task(self):
        ingress = self.r['LoadBalancerGroup']['Properties']['SecurityGroupIngress']
        self.assertEqual(ingress, [{'IpProtocol': 'tcp', 'FromPort': 443, 'ToPort': 443, 'SourcePrefixListId': {'Ref': 'CloudFrontPrefixListId'}}])
        self.assertEqual(self.r['Listener']['Properties']['DefaultActions'][0]['FixedResponseConfig']['StatusCode'], '403')
        self.assertEqual(self.r['OriginRule']['Properties']['Conditions'][0]['HttpHeaderConfig']['HttpHeaderName'], 'x-mcclinic-origin')
        service = self.r['ApiService']['Properties']
        self.assertEqual(service['NetworkConfiguration']['AwsvpcConfiguration']['AssignPublicIp'], 'DISABLED')
        self.assertFalse(service['EnableExecuteCommand'])
        self.assertTrue(service['DeploymentConfiguration']['DeploymentCircuitBreaker']['Rollback'])
        self.assertEqual(self.app['Parameters']['DesiredCount']['Default'], 0)
        self.assertEqual(self.app['Parameters']['EnableNetworkCustody']['Default'], 'false')
        self.assertIn('@sha256:', self.app['Parameters']['ApiImage']['AllowedPattern'])

    def test_no_clinical_caching_and_cookie_forwarding(self):
        policy = self.r['NoCache']['Properties']['CachePolicyConfig']
        for key in ['MinTTL', 'DefaultTTL', 'MaxTTL']:
            self.assertEqual(policy[key], 0)
        distribution = self.r['Distribution']['Properties']['DistributionConfig']
        for behavior in [distribution['DefaultCacheBehavior'], *distribution['CacheBehaviors']]:
            self.assertEqual(behavior['CachePolicyId'], {'Ref': 'NoCache'})
            self.assertEqual(behavior['ViewerProtocolPolicy'], 'https-only')
        forwarding = self.r['ApiForwarding']['Properties']['OriginRequestPolicyConfig']
        self.assertEqual(forwarding['CookiesConfig']['CookieBehavior'], 'all')
        self.assertEqual(forwarding['HeadersConfig'], {'HeaderBehavior': 'allExcept', 'Headers': ['host']})
        self.assertEqual(distribution['WebACLId'], {'Ref': 'EdgeWebAclArn'})
        self.assertTrue(all(e['ErrorCachingMinTTL'] == 0 for e in distribution['CustomErrorResponses']))
        self.assertTrue(all('ResponsePagePath' not in e for e in distribution['CustomErrorResponses']))
        csp = self.r['SecurityHeaders']['Properties']['ResponseHeadersPolicyConfig']['SecurityHeadersConfig']['ContentSecurityPolicy']['ContentSecurityPolicy']
        self.assertIn("frame-src 'self' blob:", csp)  # Preserve document preview/printing.
        self.assertNotIn("script-src 'self' 'unsafe-inline'", csp)

    def test_sink_and_secret_boundaries(self):
        task = self.r['ApiTask']['Properties']
        runtime = task['ContainerDefinitions'][0]
        self.assertTrue(runtime['ReadonlyRootFilesystem'])
        self.assertEqual(runtime['User'], '1000:1000')
        self.assertEqual(runtime['LinuxParameters']['Capabilities']['Drop'], ['ALL'])
        names = {s['Name'] for s in runtime['Secrets']}
        self.assertEqual(names, {'DB_RUNTIME_SECRET', 'IDENTITY_KMS_ENVELOPE', 'STAGING_ORIGIN_SECRET'})
        volume = task['Volumes'][0]['EFSVolumeConfiguration']
        self.assertEqual(volume['TransitEncryption'], 'ENABLED')
        self.assertEqual(volume['AuthorizationConfig']['IAM'], 'ENABLED')
        sink = self.r['Sink']
        self.assertTrue(sink['Properties']['Encrypted'])
        self.assertEqual(sink['DeletionPolicy'], 'Retain')
        self.assertNotIn('LifecyclePolicies', sink['Properties'])
        self.assertEqual(self.r['SinkAccess']['Properties']['RootDirectory']['CreationInfo']['Permissions'], '0700')
        self.assertFalse(any(r['Type'] == 'AWS::SNS::Subscription' for r in self.r.values()))

    def test_mailbox_reader_has_no_write_or_database_secret(self):
        reader = self.r['MailboxReadJob']['Properties']['ContainerDefinitions'][0]
        self.assertTrue(reader['ReadonlyRootFilesystem'])
        self.assertTrue(reader['MountPoints'][0]['ReadOnly'])
        self.assertNotIn('Secrets', reader)
        self.assertNotIn('PortMappings', reader)
        policy = self.r['MailboxReadPolicy']['Properties']['PolicyDocument']['Statement']
        self.assertEqual(len(policy), 1)
        self.assertEqual(policy[0]['Action'], 'elasticfilesystem:ClientMount')
        self.assertEqual(policy[0]['Condition']['StringEquals']['elasticfilesystem:AccessPointArn'], {'Fn::GetAtt': ['SinkAccess', 'Arn']})
        self.assertNotIn('secretsmanager:', str(self.r['MailboxExecutionRole']))
        self.assertNotIn('ClientWrite', str(policy))

    def test_bootstrap_is_separate_and_never_runs_automatically(self):
        resources = self.jobs['Resources']
        self.assertTrue(all(r['Type'] in ['AWS::ECS::TaskDefinition', 'AWS::IAM::Role'] for r in resources.values()))
        for name in ['MigrationJob', 'BootstrapJob']:
            task = resources[name]['Properties']
            self.assertEqual(task['TaskRoleArn'], {'Fn::GetAtt': ['JobRole', 'Arn']})
            self.assertNotIn('PortMappings', task['ContainerDefinitions'][0])
        normal = str(resources['MigrationExecutionRole']) + str(resources['MigrationJob'])
        self.assertNotIn('AdminSecret', normal)
        self.assertNotIn('IDENTITY_KMS_ALLOW_NETWORK', normal)
        self.assertIn('DB_ADMIN_SECRET', str(resources['BootstrapJob']))

if __name__ == '__main__':
    unittest.main(verbosity=2)
