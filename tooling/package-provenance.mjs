import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
const trees=JSON.parse(execFileSync('pnpm',['list','-r','--depth','Infinity','--json'],{encoding:'utf8',maxBuffer:64*1024*1024}));
const components=new Map();
function visit(deps){for(const [name,value] of Object.entries(deps??{})){
  if(value.version&&!value.version.startsWith('link:'))components.set(name+'@'+value.version,{type:'library',name,version:value.version,'bom-ref':name+'@'+value.version});
  visit(value.dependencies);visit(value.devDependencies);visit(value.optionalDependencies);
}}
for(const tree of trees){visit(tree.dependencies);visit(tree.devDependencies);visit(tree.optionalDependencies);}
mkdirSync('artifacts',{recursive:true});
writeFileSync('artifacts/sbom.cdx.json',JSON.stringify({bomFormat:'CycloneDX',specVersion:'1.5',version:1,metadata:{component:{type:'application',name:'mcclinic',version:process.env.SOURCE_REVISION??'unversioned'}},components:[...components.values()].sort((a,b)=>a['bom-ref'].localeCompare(b['bom-ref']))},null,2));
function sources(path){return readdirSync(path,{withFileTypes:true}).filter(e=>!['node_modules','dist','generated'].includes(e.name)).flatMap(e=>e.isDirectory()?sources(path+'/'+e.name):[path+'/'+e.name]);}
const hashes=Object.fromEntries([...sources('apps'),...sources('packages'),...sources('tooling')].sort().map(path=>[path,createHash('sha256').update(readFileSync(path)).digest('hex')]));
writeFileSync('artifacts/provenance.json',JSON.stringify({revision:process.env.SOURCE_REVISION??'unversioned',sourceHashes:hashes,node:process.version,pnpm:execFileSync('pnpm',['--version'],{encoding:'utf8'}).trim(),lockSha256:createHash('sha256').update(readFileSync('pnpm-lock.yaml')).digest('hex'),scope:'Node dependency inventory, including build tools; OS image scanning is separate.'},null,2));
