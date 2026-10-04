/* The fleet's capability map, drawn as skill trees. THIS FILE IS THE ROADMAP: every capability the fleet
   has or intends to have is one node here, owned by one agent, in one NIST CSF 2.0 category, with a rank
   that has to be earned by evidence. A capability that is not a node is not on the roadmap.

   rank 0 not built · 1 built, run by hand · 2 runs unattended on our own estate · 3 in service for you
   tier 0 phase 0 (now) · 1 phase 1 · 2 phase 2 · 3 end game
   req  ids this node needs first; "agent:id" points at another agent's node */
(function(){
var G={"lock": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\"/>", "tls": "<path d=\"M9 7V5a3 3 0 0 1 6 0v2\"/><rect x=\"6\" y=\"7\" width=\"12\" height=\"12\" rx=\"1.5\"/><path d=\"M9 11h6M9 14h6M9 17h6M5 22h14\"/>", "secret": "<circle cx=\"10\" cy=\"10\" r=\"6\"/><circle cx=\"10\" cy=\"10\" r=\"2.2\"/><path d=\"M14.5 14.5L21 21\"/>", "deps": "<circle cx=\"9\" cy=\"9\" r=\"6\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"M14.5 12c3 1 5 3.5 5 7v3M9 15v6\"/>", "code": "<rect x=\"7\" y=\"3\" width=\"12\" height=\"18\" rx=\"1.5\"/><path d=\"M5 7h3M5 11h3M5 15h3M5 19h3M11 9h5M11 13h5\"/>", "mail": "<path d=\"M5 22V3M5 4h8l-2 3 2 3H5\"/><path d=\"M13 22V12M13 13h8l-2 3 2 3h-8\"/>", "dns": "<path d=\"M12 2v5\"/><path d=\"M8 7h8l2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z\"/><circle cx=\"12\" cy=\"10.5\" r=\"1.2\"/><path d=\"M9 16h6\"/>", "kev": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 12l4-5M12 3v2M21 12h-2M12 21v-2M3 12h2\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\"/>", "cve": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"1.5\"/><path d=\"M8 8c1.3-1 2.7-1 4 0s2.7 1 4 0M8 12c1.3-1 2.7-1 4 0s2.7 1 4 0M8 16h5\"/>", "match": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"7\" rx=\"3.5\"/><path d=\"M7 8v7M17 8v7M12 15v3M9 21h6l-1-3h-4z\"/>", "cloak": "<path d=\"M12 3c-3 0-5 2-5 5l-3 13h16l-3-13c0-3-2-5-5-5z\"/><path d=\"M9 8c0-2 1.5-3 3-3s3 1 3 3M12 10v11\"/>", "gate": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\"/><circle cx=\"12\" cy=\"16\" r=\"1.2\"/>", "shred": "<path d=\"M12 12L5 3M12 12l7-9M12 12l-2.5 3M12 12l2.5 3\"/><circle cx=\"8\" cy=\"18\" r=\"3\"/><circle cx=\"16\" cy=\"18\" r=\"3\"/>", "route": "<path d=\"M4 7l5-2 6 2 5-2v12l-5 2-6-2-5 2z\"/><path d=\"M9 5v12M15 7v12M7 11h4M13 13h4\"/>", "log": "<path d=\"M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z\"/><path d=\"M8 4v16M11 9h5M11 13h5\"/>", "brief": "<rect x=\"3\" y=\"6\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M3 8l9 6 9-6\"/><circle cx=\"12\" cy=\"14\" r=\"2.2\"/>", "census": "<circle cx=\"9\" cy=\"15\" r=\"5\"/><path d=\"M12.5 11.5L21 3M18 6l2 2M15 9l2 2\"/>", "dormant": "<path d=\"M9 3h6M12 3v2\"/><rect x=\"7\" y=\"5\" width=\"10\" height=\"12\" rx=\"2\"/><path d=\"M12 8v6M6 21h12M9 17v4M15 17v4\"/>", "reset": "<rect x=\"8\" y=\"3\" width=\"8\" height=\"18\" rx=\"4\"/><path d=\"M8 8h8M8 16h8M4 12h4M16 12h4\"/>", "breach": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M9 8h6M9 12h3M14 13l-2 3h3l-2 3\"/>", "broker": "<path d=\"M5 21h11a3 3 0 0 0 3-3V3H8a3 3 0 0 0-3 3v15z\"/><path d=\"M5 21a3 3 0 0 1 0-6h11M11 8h5M11 12h5\"/>", "docleak": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M3 13h18M9 8V5h6v3M12 13v3\"/>", "device": "<path d=\"M3 4h7l7 7-7 7-7-7z\"/><circle cx=\"7\" cy=\"8\" r=\"1.2\"/><path d=\"M14 13l4 4-4 4\"/>", "firewall": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M8 21h8M12 16v5M12 2v3M20 12h-3M4 12h3M18 6l-2 2M6 6l2 2\"/>", "login": "<path d=\"M6 17V11a6 6 0 0 1 12 0v6l2 2H4z\"/><path d=\"M10 21h4\"/>", "playbook": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M12 8v6M9 11h6\"/>", "backup": "<rect x=\"3\" y=\"10\" width=\"18\" height=\"10\" rx=\"2\"/><path d=\"M5 10V8a7 3 0 0 1 14 0v2\"/><rect x=\"10.5\" y=\"12.5\" width=\"3\" height=\"3\"/>", "drill": "<path d=\"M3 11a4 4 0 0 1 4-4h8v8H7a4 4 0 0 1-4-4z\"/><path d=\"M15 9h6v4h-6\"/><circle cx=\"7\" cy=\"11\" r=\"1.2\"/>"};
var RANK=['Not built','Built, run by hand','Runs unattended on our own estate','In service for you'];
var TIER=['Phase 0, now','Phase 1','Phase 2','End game'];
var CSF={'ID.AM':'Identify: asset management','ID.RA':'Identify: risk assessment','ID.IM':'Identify: improvement','PR.AA':'Protect: identity and access','PR.DS':'Protect: data security','PR.PS':'Protect: platform security','GV.OV':'Govern: oversight','GV.OC':'Govern: organisational context','GV.PO':'Govern: policy','DE.CM':'Detect: continuous monitoring','DE.AE':'Detect: adverse event analysis','RS.MA':'Respond: incident management','RS.CO':'Respond: incident communication','RC.RP':'Recover: recovery plan execution'};
var ORDER=['squall','anchor','fathom','lookout','harbour','glass','bridge','haze'];
var A={
squall:{name:'Squall',side:'crew',spot:'#E0892B',fn:'Identify',job:'Checks sites and code for weak spots.',branches:['Code','Site and edge','Depth'],skills:[
 {id:'secret',n:'Secret scan',t:0,c:0,r:2,g:'secret',csf:'ID.RA',d:'Looks for keys and passwords left in code and its history.',ev:'Runs every night on our own repositories. You cannot point it at your own repository yet.'},
 {id:'deps',n:'Dependency audit',t:0,c:0,r:2,g:'deps',csf:'ID.RA',d:'Checks the packages a project depends on for known flaws.',ev:'Runs every night on our own repositories.'},
 {id:'code',n:'Code audit',t:0,c:0,r:2,g:'code',csf:'ID.RA',d:'Reads the code itself for common weaknesses.',ev:'Runs every night on our own repositories. A person reviews what it flags.'},
 {id:'dns',n:'Domain proof',t:0,c:1,r:3,g:'dns',csf:'ID.AM',d:'Proves you control a domain with one DNS record. Nothing is checked before this.',ev:'Self-serve at start.typhoonfleet.com.'},
 {id:'tls',n:'Headers and TLS',t:0,c:1,r:3,g:'tls',csf:'ID.RA',d:'Reads a site\'s security headers and certificate.',ev:'Self-serve once the domain is proved, then re-checked every day.',req:['dns']},
 {id:'mail',n:'Email records',t:0,c:1,r:3,g:'mail',csf:'ID.RA',d:'Checks the SPF and DMARC records that stop others sending mail as you.',ev:'Self-serve once the domain is proved.',req:['dns']},
 {id:'egress',n:'Data egress inventory',t:0,c:2,r:1,g:'route',csf:'ID.AM',d:'Records every host your running app talks to, and what it leaves in the browser.',ev:'Part of the full application review, which an operator runs by hand.'},
 {id:'repo',n:'Repository self-serve',t:1,c:0,r:0,g:'gate',csf:'ID.RA',d:'Connect a repository yourself and get the three code checks without emailing anyone.',ev:'Not built. Today code reviews start with an email.',req:['secret','deps','code']},
 {id:'recon',n:'Internet edge',t:1,c:1,r:0,g:'census',csf:'ID.AM',d:'What your domain shows the internet: forgotten subdomains, open services, exposed panels.',ev:'Designed. Bridge refuses it until the permission rules for active probing exist.',req:['tls']},
 {id:'verdict',n:'Verdict and retest',t:1,c:1,r:0,g:'brief',csf:'ID.RA',d:'One page that says where you stand, and a retest that closes each finding when it is fixed.',ev:'Not built.',req:['mail']},
 {id:'ai',n:'AI feature testing',t:1,c:2,r:0,g:'match',csf:'ID.RA',d:'Tests chatbots and AI features for prompt injection and data leaks.',ev:'Not built.',req:['egress']},
 {id:'cloud',n:'Cloud and publishing accounts',t:2,c:1,r:0,g:'backup',csf:'ID.RA',d:'Reads the settings of the accounts that host and publish your app.',ev:'Not built.',req:['recon']},
 {id:'regs',n:'Regulation mapping',t:2,c:2,r:0,g:'playbook',csf:'GV.OC',d:'Matches each finding to the rules that apply to you.',ev:'Not built.',req:['verdict']},
 {id:'cont',n:'Continuous assurance',t:3,c:0,r:0,g:'kev',csf:'ID.IM',d:'Every check on a schedule, every fix retested and closed without anyone asking.',ev:'Not built.',req:['repo','verdict']},
 {id:'alarm',n:'Alarm test',t:3,c:2,r:0,g:'firewall',csf:'ID.IM',d:'Safe, staged attack steps to see whether your alarms fire.',ev:'Not built. Needs Lookout to have something to alarm.',req:['cloud','lookout:login']}
]},
anchor:{name:'Anchor',side:'crew',spot:'#E0B43B',fn:'Protect',job:'Counts your accounts, finds the forgotten ones, maps who can reset whom.',branches:['Find','Understand','Fix'],skills:[
 {id:'census',n:'Account census',t:0,c:0,r:0,g:'census',csf:'PR.AA',d:'A list of every account you hold, found from your mailbox.',ev:'The engine runs in a sister product on a real mailbox. It is not docked to the fleet, so it scores zero here.'},
 {id:'dormant',n:'Dormant accounts',t:0,c:1,r:0,g:'dormant',csf:'PR.AA',d:'Finds accounts you have not touched in a long time.',ev:'Same engine, not docked.',req:['census']},
 {id:'reset',n:'Reset paths',t:0,c:2,r:0,g:'reset',csf:'PR.AA',d:'Shows which account can reset which, so you can see the one that unlocks the rest.',ev:'Same engine, not docked.',req:['census']},
 {id:'mfa',n:'Sign-in strength',t:1,c:1,r:0,g:'gate',csf:'PR.AA',d:'Which accounts still lack two-step sign-in or a passkey.',ev:'Not built.',req:['census']},
 {id:'close',n:'Guided clean-up',t:1,c:2,r:0,g:'shred',csf:'PR.AA',d:'Walks you to the close button of each dormant account. You press it.',ev:'Not built for the fleet.',req:['dormant']},
 {id:'more',n:'More mailboxes',t:2,c:0,r:0,g:'mail',csf:'PR.AA',d:'Mail providers beyond the first.',ev:'Not built.',req:['census']},
 {id:'pw',n:'Breached passwords',t:2,c:1,r:0,g:'breach',csf:'PR.AA',d:'Flags accounts whose password appeared in a known breach.',ev:'Not built. Needs Fathom.',req:['mfa','fathom:breach']},
 {id:'watch',n:'Identity watch',t:3,c:1,r:0,g:'kev',csf:'PR.AA',d:'Keeps the census current and tells you when a new account or a new reset path appears.',ev:'Not built.',req:['mfa','close']}
]},
fathom:{name:'Fathom',side:'crew',spot:'#7DD3B0',fn:'Identify',job:'Looks for your data where it has no business being.',branches:['Breaches','Brokers','Documents'],skills:[
 {id:'breach',n:'Breach lookup',t:0,c:0,r:0,g:'breach',csf:'ID.RA',d:'Checks whether your addresses appear in known breaches.',ev:'Not built.'},
 {id:'broker',n:'Broker sweep',t:1,c:1,r:0,g:'broker',csf:'ID.AM',d:'Finds data brokers holding your details.',ev:'Not built.',req:['breach']},
 {id:'docleak',n:'Document leaks',t:1,c:2,r:0,g:'docleak',csf:'ID.AM',d:'Looks for your documents in places they should not be.',ev:'Not built.'},
 {id:'look',n:'Lookalike domains',t:2,c:0,r:0,g:'dns',csf:'ID.RA',d:'Finds domains registered to pass as yours.',ev:'Not built.',req:['breach']},
 {id:'remove',n:'Removal requests',t:2,c:1,r:0,g:'shred',csf:'ID.AM',d:'Drafts the removal request for each broker. You send it.',ev:'Not built.',req:['broker']},
 {id:'watch',n:'Footprint watch',t:3,c:1,r:0,g:'kev',csf:'ID.RA',d:'Repeats every sweep on a schedule and reports only what changed.',ev:'Not built.',req:['remove','docleak']}
]},
lookout:{name:'Lookout',side:'crew',spot:'#C9A7F0',fn:'Detect',job:'Keeps an eye on your devices and the home network.',branches:['Devices','Network','Sign-ins'],skills:[
 {id:'device',n:'Device watch',t:0,c:0,r:0,g:'device',csf:'DE.CM',d:'Knows which devices are on your network.',ev:'Not built.'},
 {id:'firewall',n:'Firewall check',t:0,c:1,r:0,g:'firewall',csf:'DE.CM',d:'Confirms the firewall on each machine and on the router is on.',ev:'Not built.'},
 {id:'patch',n:'Patch state',t:1,c:0,r:0,g:'deps',csf:'DE.CM',d:'Which devices are behind on updates.',ev:'Not built.',req:['device']},
 {id:'login',n:'Login alerts',t:1,c:2,r:0,g:'login',csf:'DE.CM',d:'Tells you when someone signs in somewhere new.',ev:'Not built.'},
 {id:'base',n:'Normal versus odd',t:2,c:1,r:0,g:'kev',csf:'DE.AE',d:'Learns what your network usually does and flags what does not fit.',ev:'Not built.',req:['firewall','device']},
 {id:'detect',n:'Detection across devices',t:3,c:1,r:0,g:'match',csf:'DE.AE',d:'Joins device, network and sign-in signals into one alert worth reading.',ev:'Not built.',req:['base','login']}
]},
harbour:{name:'Harbour',side:'crew',spot:'#F0A3B4',fn:'Respond, Recover',job:'Gets you back on your feet after a bad night.',branches:['Respond','Recover','Accounts'],skills:[
 {id:'play',n:'First-hour playbook',t:0,c:0,r:0,g:'playbook',csf:'RS.MA',d:'What to do in the first hour, in order, for the incidents that actually happen to small teams.',ev:'Not built.'},
 {id:'backup',n:'Backup check',t:0,c:1,r:0,g:'backup',csf:'RC.RP',d:'Confirms a backup exists, is recent, and is somewhere else.',ev:'Not built.'},
 {id:'drill',n:'Recovery drill',t:1,c:1,r:0,g:'drill',csf:'RC.RP',d:'Restores one thing from backup to prove it works.',ev:'Not built.',req:['backup']},
 {id:'kit',n:'Account recovery kit',t:1,c:2,r:0,g:'reset',csf:'RC.RP',d:'The codes and contacts you need to get back into your key accounts, kept offline.',ev:'Not built. Needs Anchor.',req:['anchor:reset']},
 {id:'tell',n:'Who to tell',t:2,c:0,r:0,g:'mail',csf:'RS.CO',d:'Who you must notify, by when, with a draft.',ev:'Not built.',req:['play']},
 {id:'guided',n:'Guided response',t:3,c:1,r:0,g:'route',csf:'RS.MA',d:'Walks you through a live incident step by step and keeps the record.',ev:'Not built.',req:['play','drill']}
]},
glass:{name:'Glass',side:'service',spot:'#6FA2F0',fn:'Identify',job:'Watches the lists of flaws attackers are using right now.',branches:['Sources','Judgement','Reach'],skills:[
 {id:'kev',n:'Exploited list watch',t:0,c:0,r:2,g:'kev',csf:'ID.RA',d:'Follows the list of flaws confirmed as used in real attacks.',ev:'Runs every morning. Its output is a public list, not yet tied to anything you own.'},
 {id:'rebuild',n:'Record rebuild',t:0,c:1,r:2,g:'cve',csf:'ID.RA',d:'Fills in the severity and affected products most new entries arrive without, and says where each detail came from.',ev:'Runs every morning.'},
 {id:'digest',n:'Scored digest',t:0,c:2,r:2,g:'brief',csf:'ID.RA',d:'Ranks the day\'s flaws and publishes the top 250 with a reason for each.',ev:'Runs every morning, published through The Wang Report.',req:['kev','rebuild']},
 {id:'oss',n:'Open-source advisories',t:1,c:0,r:0,g:'deps',csf:'ID.RA',d:'GitHub advisories and OSV, the lists that cover software packages.',ev:'Not connected.',req:['kev']},
 {id:'match',n:'Asset match',t:1,c:2,r:0,g:'match',csf:'ID.RA',d:'Only the flaws that touch what you actually run.',ev:'Not built. Needs Squall\'s dependency audit to supply the list of what you run.',req:['digest','squall:deps']},
 {id:'eu',n:'More national sources',t:2,c:0,r:0,g:'log',csf:'ID.RA',d:'The EU vulnerability database and others beyond the US lists.',ev:'Not connected.',req:['oss']},
 {id:'lens',n:'Your own watch list',t:2,c:1,r:0,g:'census',csf:'ID.RA',d:'Scoring tuned to your industry and your vendors instead of ours.',ev:'Not built.',req:['rebuild']},
 {id:'alert',n:'Alert on match',t:2,c:2,r:0,g:'login',csf:'ID.RA',d:'One message when a flaw that touches you joins the exploited list.',ev:'Not built.',req:['match']},
 {id:'first',n:'Patch-first order',t:3,c:1,r:0,g:'route',csf:'ID.RA',d:'One ordered list of what to fix first across everything you run.',ev:'Not built.',req:['lens','alert']}
]},
bridge:{name:'Bridge',side:'service',spot:'#F5B26B',fn:'Govern',job:'Sends each request to the one agent whose job it is, and writes down why.',branches:['Routing','Permission','Record'],skills:[
 {id:'route',n:'Routing',t:0,c:0,r:1,g:'route',csf:'GV.OV',d:'Matches a request to one agent\'s job, or refuses it and says why.',ev:'Proved by hand in September 2026. The nightly jobs do not pass through it.'},
 {id:'gate',n:'Permission gate',t:0,c:1,r:1,g:'gate',csf:'GV.PO',d:'No job touches a target without a signed, unexpired permission naming it.',ev:'Works when the operator dispatches by hand.'},
 {id:'log',n:'Decision log',t:0,c:2,r:2,g:'log',csf:'GV.OV',d:'One line for every request and every run.',ev:'Scheduled agents write a line on every run without anyone asking.'},
 {id:'chat',n:'Request surface',t:1,c:0,r:0,g:'mail',csf:'GV.OV',d:'A place to ask the fleet for something that is not a command line.',ev:'Not built.',req:['route']},
 {id:'audit',n:'Auditor',t:1,c:2,r:0,g:'secret',csf:'GV.OV',d:'A daily read of every log that flags anything off-scope, unapproved or failed.',ev:'Designed.',req:['log']},
 {id:'cost',n:'Cost on every line',t:1,c:2,r:0,g:'cve',csf:'GV.OV',d:'Each log line carries how long the run took and how many AI calls it made.',ev:'Not built.',req:['log']},
 {id:'brief',n:'Monthly brief',t:2,c:0,r:0,g:'brief',csf:'GV.OV',d:'One page a month: what ran, what was found, what was refused, what nobody looked at.',ev:'Not built.',req:['chat','audit']},
 {id:'token',n:'Permission per action',t:2,c:1,r:0,g:'dns',csf:'GV.PO',d:'A signed token every agent must show before each action, not once per job.',ev:'Not built.',req:['gate']},
 {id:'chain',n:'Tamper-evident log',t:2,c:2,r:0,g:'lock',csf:'GV.OV',d:'Each line is chained to the one before, so a changed or missing line shows.',ev:'Not built.',req:['audit']},
 {id:'auto',n:'Unattended dispatch',t:3,c:1,r:0,g:'kev',csf:'GV.OV',d:'Routes and sends on its own, inside signed limits, with the auditor watching.',ev:'Not built.',req:['token','chain']}
]},
haze:{name:'Haze',side:'service',spot:'#9FB3CF',fn:'Protect',job:'Masks names and numbers before text leaves the room.',branches:['Mask','Gate','Seal'],skills:[
 {id:'mask',n:'Masking',t:0,c:0,r:2,g:'cloak',csf:'PR.DS',d:'Organisations become stable stand-ins, people keep a first name and a role, numbers and addresses are replaced.',ev:'Runs unattended on one internal workload.'},
 {id:'gate',n:'Leak gate',t:0,c:1,r:2,g:'gate',csf:'PR.DS',d:'A last check by fixed rules. A record that still carries something sensitive is dropped, not sent.',ev:'Runs unattended on one internal workload.',req:['mask']},
 {id:'seal',n:'Seal and shred',t:0,c:2,r:2,g:'shred',csf:'PR.DS',d:'Everything sent is locked to one key. Destroy the key and nothing sent can be read again.',ev:'Runs unattended on one internal workload. The kill switch was tested.',req:['gate']},
 {id:'measure',n:'Measured miss rate',t:1,c:0,r:0,g:'kev',csf:'PR.DS',d:'A labelled test set and a real number for how often masking misses.',ev:'Not built. Today misses are found by spot check.',req:['mask']},
 {id:'adapter',n:'Second source',t:1,c:1,r:0,g:'docleak',csf:'PR.DS',d:'A second kind of record, at which point Haze becomes its own package.',ev:'Not built.',req:['gate']},
 {id:'reid',n:'Re-identification test',t:2,c:0,r:0,g:'secret',csf:'PR.DS',d:'Tries to work out who is who from masked text, and reports how often it succeeds.',ev:'Not built.',req:['measure']},
 {id:'agents',n:'Outbound gate for agents',t:2,c:1,r:0,g:'route',csf:'PR.DS',d:'Everything any agent sends to an outside AI model passes through Haze first.',ev:'Not built.',req:['adapter']},
 {id:'policy',n:'Egress policy',t:3,c:1,r:0,g:'playbook',csf:'PR.DS',d:'Rules by class of data: what may leave, masked how, to whom. The masking half of data loss prevention.',ev:'Not built.',req:['agents','reid']}
]}
};

/* what the site needs to draw an agent anywhere: cards, menu, sub-bar. Status lives here and nowhere else. */
var META={
 squall:{role:'Checks sites and code',st:'live',label:'live',tl:[.58,.33],href:'squall/index.html',csfl:'NIST CSF 2.0: Identify. Assurance.',ph:['Your app and its code','AI and the internet edge','Accounts and cloud','Your defences']},
 anchor:{role:'Accounts and identity',st:'designed',label:'designed',tl:[.47,.44],href:'anchor/skills.html',csfl:'NIST CSF 2.0: Protect. Identity.'},
 fathom:{role:'Your data footprint',st:'planned',label:'planned',tl:[.58,.60],href:'fathom/skills.html',csfl:'NIST CSF 2.0: Identify. Footprint.'},
 lookout:{role:'Devices and home network',st:'planned',label:'planned',tl:[.56,.09],href:'lookout/skills.html',csfl:'NIST CSF 2.0: Detect.'},
 harbour:{role:'Respond and recover',st:'planned',label:'planned',tl:[.82,.60],href:'harbour/skills.html',csfl:'NIST CSF 2.0: Respond and Recover.'},
 glass:{role:'Threat intelligence',st:'live',label:'live',tl:[.47,.42],href:'glass/index.html',csfl:'NIST CSF 2.0: Identify. Threat intelligence.'},
 bridge:{role:'Routing and the decision log',st:'live',label:'live, v0',tl:[.76,.22],href:'bridge/index.html',csfl:'NIST CSF 2.0: Govern.'},
 haze:{role:'Masks what leaves the wall',st:'built',label:'built, internal',tl:[.57,.36],href:'haze/index.html',csfl:'NIST CSF 2.0: Protect. Data.'}
};
ORDER.forEach(function(k){for(var m in META[k])A[k][m]=META[k][m];A[k].id=k;});
/* the 22 categories of NIST CSF 2.0, so the coverage table can show the ones no skill touches */
var CSFALL=[['Govern',[['GV.OC','Organisational context'],['GV.RM','Risk management strategy'],['GV.RR','Roles, responsibilities and authorities'],['GV.PO','Policy'],['GV.OV','Oversight'],['GV.SC','Supply chain risk management']]],
 ['Identify',[['ID.AM','Asset management'],['ID.RA','Risk assessment'],['ID.IM','Improvement']]],
 ['Protect',[['PR.AA','Identity management, authentication and access control'],['PR.AT','Awareness and training'],['PR.DS','Data security'],['PR.PS','Platform security'],['PR.IR','Technology infrastructure resilience']]],
 ['Detect',[['DE.CM','Continuous monitoring'],['DE.AE','Adverse event analysis']]],
 ['Respond',[['RS.MA','Incident management'],['RS.AN','Incident analysis'],['RS.CO','Incident response reporting and communication'],['RS.MI','Incident mitigation']]],
 ['Recover',[['RC.RP','Incident recovery plan execution'],['RC.CO','Incident recovery communication']]]];

function pts(a){var p=0;a.skills.forEach(function(s){p+=s.r;});return [p,a.skills.length*3];}
function svg(g){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(G[g]||G.kev)+'</svg>';}
function pips(r){var h='';for(var i=1;i<=3;i++)h+='<i class="'+(i<=r?'on':'')+'"></i>';return '<span class="sk-pips" aria-hidden="true">'+h+'</span>';}
function find(aid,ref){var p=ref.split(':');var ag=p.length>1?p[0]:aid,id=p[p.length-1];var s=A[ag].skills.filter(function(x){return x.id===id;})[0];return {ag:ag,s:s};}

function tree(root,aid,base){
  var a=A[aid],P=pts(a),bt=[0,0,0,0],btm=[0,0,0,0];
  a.skills.forEach(function(s){bt[s.t]+=s.r;btm[s.t]+=3;});
  var h='<div class="sk-head"><div><h1>'+a.name+' skill tree</h1><p class="sk-job">'+a.job+' One square is one capability. Points are earned by evidence.</p></div>'+
    '<div class="sk-score"><b>'+P[0]+'</b><span>of '+P[1]+' skill points</span><div class="sk-bar"><i style="width:'+(P[0]/P[1]*100)+'%"></i></div><small>NIST CSF 2.0: '+a.fn+'</small></div></div>'+
    '<div class="sk-legend">'+RANK.map(function(r,i){return '<span>'+pips(i)+r+'</span>';}).join('')+'</div>'+
    '<div class="sk-cols"><div class="sk-tree" id="sk-tree"><svg class="sk-lines" id="sk-lines" aria-hidden="true"></svg>'+
    '<div class="sk-branches">'+a.branches.map(function(b){return '<span>'+b+'</span>';}).join('')+'</div>';
  for(var t=0;t<4;t++){
    var used=[0,0,0];
    h+='<div class="sk-tier"><div class="sk-tl"><b>'+TIER[t]+'</b><span>'+bt[t]+' of '+btm[t]+' points</span></div><div class="sk-grid">';
    a.skills.filter(function(s){return s.t===t;}).forEach(function(s){
      used[s.c]++;
      h+='<button type="button" class="sk-node r'+s.r+'" data-id="'+s.id+'" style="grid-column:'+(s.c+1)+';grid-row:'+used[s.c]+'" aria-label="'+s.n+', '+RANK[s.r]+'">'+
        '<span class="sk-ic">'+svg(s.g)+'<em>'+s.r+'/3</em></span><span class="sk-n">'+s.n+'</span></button>';
    });
    h+='</div></div>';
  }
  h+='</div><aside class="sk-detail" id="sk-detail" aria-live="polite"></aside></div><div class="sk-back" id="sk-backdrop"></div>';
  root.innerHTML=h;
  var det=document.getElementById('sk-detail'),bd=document.getElementById('sk-backdrop');
  function show(id,open){
    var s=a.skills.filter(function(x){return x.id===id;})[0]; if(!s)return;
    root.querySelectorAll('.sk-node').forEach(function(n){n.classList.toggle('sel',n.getAttribute('data-id')===id);});
    var needs=(s.req||[]).map(function(r){var f=find(aid,r);return f.ag===aid?'<button type="button" data-go="'+f.s.id+'">'+f.s.n+' '+f.s.r+'/3</button>':'<a href="'+base+f.ag+'/skills.html#'+f.s.id+'">'+A[f.ag].name+': '+f.s.n+' '+f.s.r+'/3</a>';});
    var opens=a.skills.filter(function(x){return (x.req||[]).indexOf(s.id)>-1;}).map(function(x){return '<button type="button" data-go="'+x.id+'">'+x.n+'</button>';});
    det.innerHTML='<button type="button" class="sk-x" aria-label="Close">×</button>'+
      '<div class="sk-dt"><span class="sk-ic r'+s.r+'">'+svg(s.g)+'</span><div><h3>'+s.n+'</h3><div class="sk-rk">'+pips(s.r)+'<b>'+s.r+' of 3.</b> '+RANK[s.r]+'</div></div></div>'+
      '<p>'+s.d+'</p>'+
      '<dl><dt>Why this rank</dt><dd>'+s.ev+'</dd>'+
      '<dt>Phase</dt><dd>'+TIER[s.t]+'</dd>'+
      '<dt>Framework</dt><dd>NIST CSF 2.0 '+s.csf+'. '+CSF[s.csf]+'</dd>'+
      (needs.length?'<dt>Needs first</dt><dd class="sk-links">'+needs.join('')+'</dd>':'')+
      (opens.length?'<dt>Opens the way to</dt><dd class="sk-links">'+opens.join('')+'</dd>':'')+'</dl>';
    if(open){det.classList.add('open');bd.classList.add('open');}
    history.replaceState(null,'','#'+id);
  }
  function close(){det.classList.remove('open');bd.classList.remove('open');}
  root.addEventListener('click',function(e){
    var n=e.target.closest('.sk-node'); if(n){show(n.getAttribute('data-id'),true);return;}
    var g=e.target.closest('[data-go]'); if(g){show(g.getAttribute('data-go'),true);return;}
    if(e.target.closest('.sk-x')||e.target===bd)close();
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  function lines(){
    var tr=document.getElementById('sk-tree'),sv=document.getElementById('sk-lines'),b=tr.getBoundingClientRect(),p='';
    sv.setAttribute('width',b.width);sv.setAttribute('height',b.height);sv.setAttribute('viewBox','0 0 '+b.width+' '+b.height);
    a.skills.forEach(function(s){(s.req||[]).forEach(function(r){
      if(r.indexOf(':')>-1)return; var f=find(aid,r);
      var x=tr.querySelector('[data-id="'+f.s.id+'"] .sk-ic'),y=tr.querySelector('[data-id="'+s.id+'"] .sk-ic'); if(!x||!y)return;
      var A1=x.getBoundingClientRect(),B1=y.getBoundingClientRect();
      var x1=A1.left+A1.width/2-b.left,y1=A1.bottom-b.top,x2=B1.left+B1.width/2-b.left,y2=B1.top-b.top;
      var d;
      if(y2>y1+4){var m=y2-12;d='M'+x1+' '+y1+'V'+m+'H'+x2+'V'+y2;}
      else{y1=A1.top+A1.height/2-b.top;y2=B1.top+B1.height/2-b.top;x1=x2>x1?A1.right-b.left:A1.left-b.left;x2=x2>x1?B1.left-b.left:B1.right-b.left;d='M'+x1+' '+y1+'H'+x2;}
      p+='<path d="'+d+'" class="'+(f.s.r>0&&s.r>0?'lit':(f.s.r>0?'half':''))+'"/>';
    });});
    sv.innerHTML=p;
  }
  lines(); window.addEventListener('resize',lines); if(document.fonts&&document.fonts.ready)document.fonts.ready.then(lines); setTimeout(lines,600);
  var start=location.hash.slice(1), wide=window.matchMedia('(min-width:980px)').matches;
  if(start&&a.skills.some(function(s){return s.id===start;}))show(start,true);
  else if(wide)show(a.skills[0].id,false);
}

function overview(root,base){
  function card(id){var a=A[id],P=pts(a),live=a.skills.filter(function(s){return s.r>0;}).length;
    return '<a class="sk-card" href="'+base+id+'/skills.html" style="--spot:'+a.spot+'"><img src="'+base+'fleet/art/'+id+'-tile.jpg" alt="" loading="lazy">'+
      '<div><h3>'+a.name+'</h3><p>'+a.job+'</p><div class="sk-bar"><i style="width:'+(P[0]/P[1]*100)+'%"></i></div>'+
      '<small><b>'+P[0]+' of '+P[1]+'</b> points · '+live+' of '+a.skills.length+' skills built · CSF '+a.fn+'</small></div></a>';}
  var tot=[0,0];ORDER.forEach(function(id){var P=pts(A[id]);tot[0]+=P[0];tot[1]+=P[1];});
  var crew=ORDER.filter(function(i){return A[i].side==='crew';}),serv=ORDER.filter(function(i){return A[i].side==='service';});
  root.innerHTML='<div class="sk-head"><div><h1>Fleet skill trees</h1><p class="sk-job">Every capability the fleet has or intends to have is one square on one agent\'s tree. Points are earned by evidence: built, running unattended, in service for you.</p></div>'+
    '<div class="sk-score"><b>'+tot[0]+'</b><span>of '+tot[1]+' skill points</span><div class="sk-bar"><i style="width:'+(tot[0]/tot[1]*100)+'%"></i></div><small>across eight agents</small></div></div>'+
    '<div class="sk-legend">'+RANK.map(function(r,i){return '<span>'+pips(i)+r+'</span>';}).join('')+'</div>'+
    '<h2 class="sk-h2">The crew</h2><p class="sk-sub">Agents that check something of yours. One per job a security team does.</p><div class="sk-cards">'+crew.map(card).join('')+'</div>'+
    '<h2 class="sk-h2">Fleet services</h2><p class="sk-sub">They work behind the wall. They do not check your estate; they inform, govern and protect the crew that does.</p><div class="sk-cards">'+serv.map(card).join('')+'</div>';
}

/* ---- generated blocks: every list of capabilities on the site is drawn from the data above ---- */
var LOCK='<span class="lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+G.lock+'</svg></span>';
function t0(a){return a.skills.filter(function(s){return s.t===0;});}
/* home: crew cards for one side */
function cards(root,base,sideName){
  root.innerHTML=ORDER.filter(function(k){return A[k].side===sideName;}).map(function(k){var a=A[k];
    return '<a class="card '+a.st+'" href="'+base+a.href+'" style="--spot:'+a.spot+';--lx:'+(a.tl[0]*100)+'%;--ly:'+(a.tl[1]*100)+'%" aria-label="'+a.name+', '+a.label+'">'+
     '<div class="tile"><img src="'+base+'fleet/art/'+k+'-tile.jpg" alt="" loading="lazy"><div class="fogx"></div><div class="light"></div><div class="point"></div><div class="scuff"></div><div class="bar"><h3>'+a.name+'</h3></div></div>'+
     '<div class="body"><div class="job">'+a.job+'</div><div class="csf">'+a.csfl+'</div><span class="pill '+a.st+'"><i></i>'+a.label+'</span>'+
     '<div class="kit">'+t0(a).map(function(s){var o=s.r>0;return '<div class="kc '+(o?'on':'off')+'"><span class="item '+(o?'on':'off')+'">'+svg(s.g)+LOCK+'</span><span>'+s.n+'</span></div>';}).join('')+'</div>'+
     '</div></a>';}).join('');
}
/* agent pages: the kit is the phase 0 skills */
function kit(root,aid){
  root.innerHTML=t0(A[aid]).map(function(s){return '<div class="kc'+(s.r>0?'':' off')+'"><span class="item" aria-hidden="true">'+svg(s.g)+'</span><b>'+s.n+'</b><span class="d">'+s.d+'</span><span class="state">'+RANK[s.r]+'</span></div>';}).join('');
}
/* agent pages: the phases are the tiers. from=1 leaves phase 0 out (it is the kit) */
function phases(root,aid,style,from){
  var a=A[aid],h='';
  for(var t=from||0;t<4;t++){var L=a.skills.filter(function(s){return s.t===t;}); if(!L.length)continue;
    var now=t===0, title=a.ph?a.ph[t]:'';
    if(style==='road') h+='<div class="step'+(now?' now':'')+'"><span class="dot"></span><h3>'+(t<3?'Phase '+t:'End game')+'</h3><p class="sub">'+(now?'Now':title)+'</p><ul>'+L.map(function(s){return '<li>'+s.n+'<small>'+s.d+'</small></li>';}).join('')+'</ul></div>';
    else h+='<div class="ph'+(now?' now':'')+'"><span class="k"><i></i>'+TIER[t]+'</span>'+(title?'<h3>'+title+'</h3>':'')+'<ul>'+L.map(function(s){return '<li>'+s.n+'</li>';}).join('')+'</ul></div>';
  }
  root.innerHTML=h;
}
/* the enterprise view: every NIST CSF 2.0 category, and which skills sit in it */
function coverage(root,base){
  var by={};ORDER.forEach(function(k){A[k].skills.forEach(function(s){(by[s.csf]=by[s.csf]||[]).push({a:k,s:s});});});
  var any=0,built=0,h='';
  CSFALL.forEach(function(f){
    h+='<h3 class="sk-fn">'+f[0]+'</h3><div class="rows">';
    f[1].forEach(function(c){var L=by[c[0]]||[],p=0,own={};L.forEach(function(x){p+=x.s.r;own[x.a]=(own[x.a]||0)+1;});
      if(L.length)any++; if(p>0)built++;
      var who=Object.keys(own).map(function(k){return '<a href="'+base+k+'/skills.html">'+A[k].name+'</a> '+own[k];}).join(', ');
      h+='<div class="row'+(L.length?'':' gap')+'"><b>'+c[1]+'<small>'+c[0]+'</small></b><span>'+(L.length?who+(L.length===1?' skill':' skills')+'. <b>'+p+' of '+(L.length*3)+'</b> points.<i class="sk-bar"><i style="width:'+(p/(L.length*3)*100)+'%"></i></i>':'No skill on any tree.')+'</span></div>';});
    h+='</div>';});
  root.innerHTML='<p class="sk-sub"><b>'+any+' of 22</b> categories have at least one skill on a tree. <b>'+built+' of 22</b> have one that is built. A skill in a category is not coverage of the category: it is one thing the fleet can do there.</p>'+h;
}
function run(){
  document.querySelectorAll('[data-sk]').forEach(function(el){
    var k=el.getAttribute('data-sk'),ag=el.getAttribute('data-agent'),base=el.getAttribute('data-base')||'';
    if(k==='tree')tree(el,ag,base); else if(k==='overview')overview(el,base); else if(k==='coverage')coverage(el,base);
    else if(k==='cards')cards(el,base,el.getAttribute('data-side')); else if(k==='kit')kit(el,ag);
    else if(k==='phases')phases(el,ag,el.getAttribute('data-style'),+el.getAttribute('data-from')||0);
  });
}
window.TF_SKILLS={agents:A,order:ORDER,points:pts};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
