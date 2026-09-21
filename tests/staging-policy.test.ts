import { readFileSync } from 'node:fs';
import { it, expect, describe } from 'vitest';
import { decodeCloudFormation } from './support/cloudformation.js';
const template = (name: string) =>
  decodeCloudFormation(
    readFileSync(
      new URL('../infrastructure/aws/' + name, import.meta.url),
      'utf8',
    ),
  );
const base = template('staging-foundation.yaml'),
  edge = template('staging-edge-access.yaml');
const app = template('staging-application.yaml'),
  jobs = template('staging-database-jobs.yaml');
// These ten named scenarios retain every assertion in the two preserved Python suites.
// YAML is test input, never an executable template or an AWS SDK request.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resourceValues = (resources: Record<string, any>) =>
  Object.values(resources);

describe('foundation policy parity', () => {
  const r = base.Resources;
  it('private encrypted database and retained storage', () => {
    const db = r.Database.Properties;
    expect(db.DBName).toBe('mcclinic');
    expect(db.PubliclyAccessible).toBe(false);
    expect(db.StorageEncrypted).toBe(true);
    expect(db.ManageMasterUserPassword).toBe(true);
    expect(db.DeletionProtection).toBe(true);
    expect(db.DeleteAutomatedBackups).toBe(false);
    expect(db).not.toHaveProperty('MasterUserPassword');
    expect(r.DatabaseParameters.Properties.Parameters['rds.force_ssl']).toBe(
      '1',
    );
    for (const name of [
      'Database',
      'StorageKey',
      'IdentityKey',
      'Registry',
      'WebAssets',
      'ApiLogs',
    ]) {
      expect(r[name].DeletionPolicy).toBe('Retain');
      expect(r[name].UpdateReplacePolicy).toBe('Retain');
    }
    expect(
      Object.values(
        r.WebAssets.Properties.PublicAccessBlockConfiguration,
      ).every(Boolean),
    ).toBe(true);
    expect(r.WebAssets.Properties.VersioningConfiguration.Status).toBe(
      'Enabled',
    );
    expect(r.WebAssets.Properties).not.toHaveProperty('LifecycleConfiguration');
    expect(r.Registry.Properties).not.toHaveProperty('LifecyclePolicy');
  });
  it('network cannot expose runtime or database', () => {
    for (const subnet of ['PrivateA', 'PrivateB'])
      expect(r[subnet].Properties.MapPublicIpOnLaunch).toBe(false);
    expect(r.RuntimeGroup.Properties).not.toHaveProperty(
      'SecurityGroupIngress',
    );
    expect(r.DatabaseGroup.Properties.SecurityGroupIngress).toEqual([
      {
        IpProtocol: 'tcp',
        FromPort: 5432,
        ToPort: 5432,
        SourceSecurityGroupId: { Ref: 'RuntimeGroup' },
      },
    ]);
    expect(
      resourceValues(r).some((resource) =>
        [
          'AWS::EC2::InternetGateway',
          'AWS::EC2::NatGateway',
          'AWS::ECS::Service',
        ].includes(resource.Type),
      ),
    ).toBe(false);
    const endpoints = resourceValues(r).filter(
      (resource) => resource.Type === 'AWS::EC2::VPCEndpoint',
    );
    expect(endpoints).toHaveLength(6);
    for (const endpoint of endpoints)
      if (endpoint.Properties.VpcEndpointType === 'Interface') {
        expect(endpoint.Properties.PrivateDnsEnabled).toBe(true);
        expect(endpoint.Properties.SecurityGroupIds).toEqual([
          { Ref: 'EndpointGroup' },
        ]);
      }
    for (const group of ['RuntimeGroup', 'DatabaseGroup', 'EndpointGroup'])
      for (const rule of r[group].Properties.SecurityGroupEgress ?? [])
        expect(rule.CidrIp).not.toBe('0.0.0.0/0');
  });
  it('runtime cannot read master secret or manage keys', () => {
    const statements =
      r.RuntimeRole.Properties.Policies[0].PolicyDocument.Statement;
    expect(statements).toHaveLength(1);
    expect(statements[0].Action).toBe('kms:Decrypt');
    expect(statements[0].Resource).toEqual({
      'Fn::GetAtt': ['IdentityKey', 'Arn'],
    });
    expect(
      statements[0].Condition.StringEquals['kms:EncryptionContext:environment'],
    ).toBe('synthetic-staging');
    const execution =
      r.ExecutionRole.Properties.Policies[0].PolicyDocument.Statement;
    expect(
      execution.filter(
        (s: { Action: string }) => s.Action === 'secretsmanager:GetSecretValue',
      )[0].Resource,
    ).toEqual({ Ref: 'RuntimeDatabaseSecretArn' });
    expect(JSON.stringify(base.Outputs)).not.toContain('MasterUserSecret');
    for (const s of execution)
      if (s.Resource === '*')
        expect(s.Action).toBe('ecr:GetAuthorizationToken');
  });
  it('budget requires owner input and sends no email subscriptions', () => {
    expect(base.Parameters.MonthlyBudgetUsd).not.toHaveProperty('Default');
    expect(
      r.Budget.Properties.NotificationsWithSubscribers.map(
        (n: { Notification: { Threshold: number } }) =>
          n.Notification.Threshold,
      ),
    ).toEqual([50, 80, 100]);
    expect(
      resourceValues(r).some(
        (resource) => resource.Type === 'AWS::SNS::Subscription',
      ),
    ).toBe(false);
    expect(base.Rules.SingaporeOnly.Assertions[0].Assert).toEqual({
      'Fn::Equals': [{ Ref: 'AWS::Region' }, 'ap-southeast-1'],
    });
  });
  it('edge denies unlisted visitors and avoids request payload sampling', () => {
    const p = edge.Parameters.TesterCidrs;
    expect(p).not.toHaveProperty('Default');
    const cidr = new RegExp('^(?:' + p.AllowedPattern + ')$');
    expect(cidr.test('0.0.0.0/0')).toBe(false);
    expect(cidr.test('203.0.113.10/32')).toBe(true);
    const acl = edge.Resources.WebAcl.Properties;
    expect(acl.DefaultAction).toEqual({ Block: {} });
    expect(acl.VisibilityConfig.SampledRequestsEnabled).toBe(false);
    expect(acl.Rules[0].Action).toEqual({ Block: {} });
    expect(acl.Rules[1].Statement).toEqual({
      IPSetReferenceStatement: { Arn: { 'Fn::GetAtt': ['Testers', 'Arn'] } },
    });
    for (const rule of acl.Rules)
      expect(rule.VisibilityConfig.SampledRequestsEnabled).toBe(false);
  });
});
describe('application policy parity', () => {
  const r = app.Resources;
  it('origin and private task', () => {
    expect(r.LoadBalancerGroup.Properties.SecurityGroupIngress).toEqual([
      {
        IpProtocol: 'tcp',
        FromPort: 443,
        ToPort: 443,
        SourcePrefixListId: { Ref: 'CloudFrontPrefixListId' },
      },
    ]);
    expect(
      r.Listener.Properties.DefaultActions[0].FixedResponseConfig.StatusCode,
    ).toBe('403');
    expect(
      r.OriginRule.Properties.Conditions[0].HttpHeaderConfig.HttpHeaderName,
    ).toBe('x-mcclinic-origin');
    const service = r.ApiService.Properties;
    expect(
      service.NetworkConfiguration.AwsvpcConfiguration.AssignPublicIp,
    ).toBe('DISABLED');
    expect(service.EnableExecuteCommand).toBe(false);
    expect(
      service.DeploymentConfiguration.DeploymentCircuitBreaker.Rollback,
    ).toBe(true);
    expect(app.Parameters.DesiredCount.Default).toBe(0);
    expect(app.Parameters.EnableNetworkCustody.Default).toBe('false');
    expect(app.Parameters.ApiImage.AllowedPattern).toContain('@sha256:');
  });
  it('no clinical caching and cookie forwarding', () => {
    const policy = r.NoCache.Properties.CachePolicyConfig;
    for (const key of ['MinTTL', 'DefaultTTL', 'MaxTTL'])
      expect(policy[key]).toBe(0);
    const distribution = r.Distribution.Properties.DistributionConfig;
    for (const behavior of [
      distribution.DefaultCacheBehavior,
      ...distribution.CacheBehaviors,
    ]) {
      expect(behavior.CachePolicyId).toEqual({ Ref: 'NoCache' });
      expect(behavior.ViewerProtocolPolicy).toBe('https-only');
    }
    const forwarding = r.ApiForwarding.Properties.OriginRequestPolicyConfig;
    expect(forwarding.CookiesConfig.CookieBehavior).toBe('all');
    expect(forwarding.HeadersConfig).toEqual({
      HeaderBehavior: 'allExcept',
      Headers: ['host'],
    });
    expect(distribution.WebACLId).toEqual({ Ref: 'EdgeWebAclArn' });
    for (const e of distribution.CustomErrorResponses) {
      expect(e.ErrorCachingMinTTL).toBe(0);
      expect(e).not.toHaveProperty('ResponsePagePath');
    }
    const csp =
      r.SecurityHeaders.Properties.ResponseHeadersPolicyConfig
        .SecurityHeadersConfig.ContentSecurityPolicy.ContentSecurityPolicy;
    expect(csp).toContain("frame-src 'self' blob:");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
  });
  it('sink and secret boundaries', () => {
    const task = r.ApiTask.Properties,
      runtime = task.ContainerDefinitions[0];
    expect(runtime.ReadonlyRootFilesystem).toBe(true);
    expect(runtime.User).toBe('1000:1000');
    expect(runtime.LinuxParameters.Capabilities.Drop).toEqual(['ALL']);
    expect(
      new Set(runtime.Secrets.map((s: { Name: string }) => s.Name)),
    ).toEqual(
      new Set([
        'DB_RUNTIME_SECRET',
        'IDENTITY_KMS_ENVELOPE',
        'STAGING_ORIGIN_SECRET',
      ]),
    );
    const volume = task.Volumes[0].EFSVolumeConfiguration;
    expect(volume.TransitEncryption).toBe('ENABLED');
    expect(volume.AuthorizationConfig.IAM).toBe('ENABLED');
    expect(r.Sink.Properties.Encrypted).toBe(true);
    expect(r.Sink.DeletionPolicy).toBe('Retain');
    expect(r.Sink.Properties).not.toHaveProperty('LifecyclePolicies');
    expect(r.SinkAccess.Properties.RootDirectory.CreationInfo.Permissions).toBe(
      '0700',
    );
    expect(
      resourceValues(r).some(
        (resource) => resource.Type === 'AWS::SNS::Subscription',
      ),
    ).toBe(false);
  });
  it('mailbox reader has no write or database secret', () => {
    const reader = r.MailboxReadJob.Properties.ContainerDefinitions[0];
    expect(reader.ReadonlyRootFilesystem).toBe(true);
    expect(reader.MountPoints[0].ReadOnly).toBe(true);
    expect(reader).not.toHaveProperty('Secrets');
    expect(reader).not.toHaveProperty('PortMappings');
    const policy = r.MailboxReadPolicy.Properties.PolicyDocument.Statement;
    expect(policy).toHaveLength(1);
    expect(policy[0].Action).toBe('elasticfilesystem:ClientMount');
    expect(
      policy[0].Condition.StringEquals['elasticfilesystem:AccessPointArn'],
    ).toEqual({ 'Fn::GetAtt': ['SinkAccess', 'Arn'] });
    expect(JSON.stringify(r.MailboxExecutionRole)).not.toContain(
      'secretsmanager:',
    );
    expect(JSON.stringify(policy)).not.toContain('ClientWrite');
  });
  it('bootstrap is separate and never runs automatically', () => {
    const resources = jobs.Resources;
    expect(
      resourceValues(resources).every((resource) =>
        ['AWS::ECS::TaskDefinition', 'AWS::IAM::Role'].includes(resource.Type),
      ),
    ).toBe(true);
    for (const name of ['MigrationJob', 'BootstrapJob']) {
      const task = resources[name].Properties;
      expect(task.TaskRoleArn).toEqual({ 'Fn::GetAtt': ['JobRole', 'Arn'] });
      expect(task.ContainerDefinitions[0]).not.toHaveProperty('PortMappings');
    }
    const normal =
      JSON.stringify(resources.MigrationExecutionRole) +
      JSON.stringify(resources.MigrationJob);
    expect(normal).not.toContain('AdminSecret');
    expect(normal).not.toContain('IDENTITY_KMS_ALLOW_NETWORK');
    expect(JSON.stringify(resources.BootstrapJob)).toContain('DB_ADMIN_SECRET');
  });
});
it('rejects unknown tags, duplicate keys and missing resources instead of silently losing policy expressions', () => {
  for (const yaml of [
    'Resources: !Execute something',
    'Resources: {}\nResources: {}',
    'Other: {}',
  ])
    expect(() => decodeCloudFormation(yaml)).toThrow();
  expect(
    decodeCloudFormation(
      'Resources: { Test: !GetAtt Database.Endpoint.Address }',
    ).Resources.Test,
  ).toEqual({ 'Fn::GetAtt': ['Database', 'Endpoint.Address'] });
});
