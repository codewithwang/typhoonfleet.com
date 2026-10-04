/* The fleet's capability map, drawn as skill trees. THIS FILE IS THE ROADMAP: every capability the fleet
   has or intends to have is one node here, owned by one agent, in one NIST CSF 2.0 category, with a rank
   that has to be earned by evidence. A capability that is not a node is not on the roadmap.

   rank (maturity) 0 not built · 1 built · 2 running · 3 live · 4 world class (measured and independently checked)
   tier 0 now · 1 next · 2 later · 3 end game (sequencing only; pages group by rank)
   req  ids this node needs first; "agent:id" points at another agent's node */
(function(){
/* The public name of the record-keeping agent lives here and nowhere else; the generator reads this line. */
var MANIFEST_NAME='Manifest';
var G={"lock": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 11V8a4 4 0 0 1 8 0v3\"/>", "tls": "<path d=\"M9 7V5a3 3 0 0 1 6 0v2\"/><rect x=\"6\" y=\"7\" width=\"12\" height=\"12\" rx=\"1.5\"/><path d=\"M9 11h6M9 14h6M9 17h6M5 22h14\"/>", "secret": "<circle cx=\"10\" cy=\"10\" r=\"6\"/><circle cx=\"10\" cy=\"10\" r=\"2.2\"/><path d=\"M14.5 14.5L21 21\"/>", "deps": "<circle cx=\"9\" cy=\"9\" r=\"6\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"M14.5 12c3 1 5 3.5 5 7v3M9 15v6\"/>", "code": "<rect x=\"7\" y=\"3\" width=\"12\" height=\"18\" rx=\"1.5\"/><path d=\"M5 7h3M5 11h3M5 15h3M5 19h3M11 9h5M11 13h5\"/>", "mail": "<path d=\"M5 22V3M5 4h8l-2 3 2 3H5\"/><path d=\"M13 22V12M13 13h8l-2 3 2 3h-8\"/>", "dns": "<path d=\"M12 2v5\"/><path d=\"M8 7h8l2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z\"/><circle cx=\"12\" cy=\"10.5\" r=\"1.2\"/><path d=\"M9 16h6\"/>", "kev": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 12l4-5M12 3v2M21 12h-2M12 21v-2M3 12h2\"/><circle cx=\"12\" cy=\"12\" r=\"1.2\"/>", "cve": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"1.5\"/><path d=\"M8 8c1.3-1 2.7-1 4 0s2.7 1 4 0M8 12c1.3-1 2.7-1 4 0s2.7 1 4 0M8 16h5\"/>", "match": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"7\" rx=\"3.5\"/><path d=\"M7 8v7M17 8v7M12 15v3M9 21h6l-1-3h-4z\"/>", "cloak": "<path d=\"M12 3c-3 0-5 2-5 5l-3 13h16l-3-13c0-3-2-5-5-5z\"/><path d=\"M9 8c0-2 1.5-3 3-3s3 1 3 3M12 10v11\"/>", "gate": "<rect x=\"5\" y=\"11\" width=\"14\" height=\"10\" rx=\"2\"/><path d=\"M8 11V7a4 4 0 0 1 8 0v4\"/><circle cx=\"12\" cy=\"16\" r=\"1.2\"/>", "shred": "<path d=\"M12 12L5 3M12 12l7-9M12 12l-2.5 3M12 12l2.5 3\"/><circle cx=\"8\" cy=\"18\" r=\"3\"/><circle cx=\"16\" cy=\"18\" r=\"3\"/>", "route": "<path d=\"M4 7l5-2 6 2 5-2v12l-5 2-6-2-5 2z\"/><path d=\"M9 5v12M15 7v12M7 11h4M13 13h4\"/>", "log": "<path d=\"M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z\"/><path d=\"M8 4v16M11 9h5M11 13h5\"/>", "brief": "<rect x=\"3\" y=\"6\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M3 8l9 6 9-6\"/><circle cx=\"12\" cy=\"14\" r=\"2.2\"/>", "census": "<circle cx=\"9\" cy=\"15\" r=\"5\"/><path d=\"M12.5 11.5L21 3M18 6l2 2M15 9l2 2\"/>", "dormant": "<path d=\"M9 3h6M12 3v2\"/><rect x=\"7\" y=\"5\" width=\"10\" height=\"12\" rx=\"2\"/><path d=\"M12 8v6M6 21h12M9 17v4M15 17v4\"/>", "reset": "<rect x=\"8\" y=\"3\" width=\"8\" height=\"18\" rx=\"4\"/><path d=\"M8 8h8M8 16h8M4 12h4M16 12h4\"/>", "breach": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M9 8h6M9 12h3M14 13l-2 3h3l-2 3\"/>", "broker": "<path d=\"M5 21h11a3 3 0 0 0 3-3V3H8a3 3 0 0 0-3 3v15z\"/><path d=\"M5 21a3 3 0 0 1 0-6h11M11 8h5M11 12h5\"/>", "docleak": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"13\" rx=\"2\"/><path d=\"M3 13h18M9 8V5h6v3M12 13v3\"/>", "device": "<path d=\"M3 4h7l7 7-7 7-7-7z\"/><circle cx=\"7\" cy=\"8\" r=\"1.2\"/><path d=\"M14 13l4 4-4 4\"/>", "firewall": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M8 21h8M12 16v5M12 2v3M20 12h-3M4 12h3M18 6l-2 2M6 6l2 2\"/>", "login": "<path d=\"M6 17V11a6 6 0 0 1 12 0v6l2 2H4z\"/><path d=\"M10 21h4\"/>", "playbook": "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M12 8v6M9 11h6\"/>", "backup": "<rect x=\"3\" y=\"10\" width=\"18\" height=\"10\" rx=\"2\"/><path d=\"M5 10V8a7 3 0 0 1 14 0v2\"/><rect x=\"10.5\" y=\"12.5\" width=\"3\" height=\"3\"/>", "drill": "<path d=\"M3 11a4 4 0 0 1 4-4h8v8H7a4 4 0 0 1-4-4z\"/><path d=\"M15 9h6v4h-6\"/><circle cx=\"7\" cy=\"11\" r=\"1.2\"/>"};
var RANK=['Not built','Built','Running','Live','World class'];
var RANKD=['','Works when a person starts it.','Runs on its own, on a schedule.','You can switch it on yourself.','Accuracy measured against a test set and checked independently.'];
var MAX=4;
var TIER=['Now','Next','Later','End game'];
var CSF={'ID.AM':'Identify: asset management','ID.RA':'Identify: risk assessment','ID.IM':'Identify: improvement','PR.AA':'Protect: identity and access','PR.DS':'Protect: data security','PR.PS':'Protect: platform security','GV.OV':'Govern: oversight','GV.OC':'Govern: organisational context','GV.PO':'Govern: policy','DE.CM':'Detect: continuous monitoring','DE.AE':'Detect: adverse event analysis','RS.MA':'Respond: incident management','RS.CO':'Respond: incident communication','RC.RP':'Recover: recovery plan execution','GV.RM':'Govern: risk management strategy','GV.RR':'Govern: roles and responsibilities','GV.SC':'Govern: supply chain risk','PR.AT':'Protect: awareness and training','PR.IR':'Protect: infrastructure resilience','RS.AN':'Respond: incident analysis','RS.MI':'Respond: incident mitigation','RC.CO':'Recover: recovery communication'};
var ORDER=['manifest','squall','anchor','fathom','lookout','harbour','glass','bridge','haze'];
var A={
manifest:{name:MANIFEST_NAME,side:'crew',spot:'#A67C52',fn:'Identify',job:'Keeps the record of what you own.',branches:['Register','Know','Keep'],skills:[
 {id:'dns',n:'Domain proof',t:0,c:0,r:3,g:'dns',csf:'ID.AM',d:'Proves you own the domain. The crew looks only after this.',ev:'Self-serve at start.typhoonfleet.com.',enrol:true},
 {id:'registry',n:'Asset record',t:0,c:0,r:1,g:'log',csf:'ID.AM',d:'One list of everything you have enrolled.',ev:'',req:['dns']},
 {id:'stack',n:'Technology fingerprint',t:0,c:1,r:0,g:'code',csf:'ID.AM',d:'Works out what your site is built with and who hosts it.',ev:'',req:['dns']},
 {id:'self',n:'Your name and handles',t:1,c:0,r:0,g:'cloak',csf:'ID.AM',d:'Registers your name and public handles so Fathom can look for them.',ev:'',req:['registry']},
 {id:'email',n:'Email account',t:1,c:0,r:0,g:'mail',csf:'ID.AM',d:'Adds a mailbox you own with read-only access.',ev:'',req:['registry']},
 {id:'repo',n:'Repository',t:1,c:0,r:0,g:'gate',csf:'ID.AM',d:'Connects a code repository with read-only access.',ev:'',req:['registry']},
 {id:'owners',n:'Who owns what',t:1,c:1,r:0,g:'reset',csf:'GV.RR',d:'Records who is responsible for each asset.',ev:'',req:['registry']},
 {id:'crown',n:'What matters most',t:1,c:1,r:0,g:'kev',csf:'ID.AM',d:'You name what would hurt most to lose. Every finding is weighed by it.',ev:'',req:['registry']},
 {id:'consent',n:'Permission per agent',t:1,c:2,r:0,g:'lock',csf:'GV.PO',d:'You switch each agent on for each asset.',ev:'',req:['registry','bridge:gate']},
 {id:'shadow',n:'Forgotten assets',t:1,c:0,r:0,g:'census',csf:'ID.AM',d:'Finds subdomains and hosts you forgot you had from public records.',ev:'',req:['dns']},
 {id:'cloudacct',n:'Hosting accounts',t:2,c:0,r:0,g:'backup',csf:'ID.AM',d:'Adds the accounts that host and publish your site.',ev:'',req:['registry','bridge:token']},
 {id:'device',n:'Devices',t:2,c:0,r:0,g:'device',csf:'ID.AM',d:'Registers a computer or phone you own.',ev:'',req:['registry']},
 {id:'config',n:'Configuration baseline',t:2,c:1,r:0,g:'tls',csf:'PR.PS',d:'Records how each asset is set up and tells you when it changes.',ev:'',req:['stack']},
 {id:'supply',n:'Suppliers',t:2,c:1,r:0,g:'route',csf:'GV.SC',d:'Lists the outside services your assets depend on.',ev:'',req:['stack','squall:egress']},
 {id:'map',n:'Your estate',t:3,c:2,r:0,g:'brief',csf:'ID.AM',d:'One picture of everything you own and who is watching it.',ev:'',req:['registry','consent']},
 {id:'census',n:'Complete record',t:3,c:0,r:0,g:'dormant',csf:'ID.AM',d:'Finds what you own that you did not tell us about and asks whether to add it.',ev:'',req:['shadow','map']}
]},
squall:{name:'Squall',side:'crew',spot:'#E0892B',fn:'Identify',job:'Checks sites and code for weak spots.',branches:['Code','Site and edge','Depth'],skills:[
 {id:'secret',n:'Secret scan',t:0,c:0,r:2,g:'secret',csf:'ID.RA',d:'Looks for keys and passwords left in code and its history.',ev:'Email us to run it on your repository.',req:['bridge:gate']},
 {id:'deps',n:'Dependency audit',t:0,c:0,r:2,g:'deps',csf:'ID.RA',d:'Checks the packages your code uses for known flaws.',ev:'Email us to run it on your repository.',req:['bridge:gate']},
 {id:'code',n:'Code audit',t:0,c:0,r:2,g:'code',csf:'ID.RA',d:'Reads the code for common weaknesses.',ev:'Email us to run it on your repository.',req:['bridge:gate']},
 {id:'tls',n:'Site security settings',t:0,c:1,r:3,g:'tls',csf:'ID.RA',d:'Checks your site\'s security settings and certificate.',ev:'Self-serve once your domain is proved, then re-checked daily.',req:['manifest:dns']},
 {id:'mail',n:'Email protection',t:0,c:1,r:3,g:'mail',csf:'ID.RA',d:'Checks that no one else can send email pretending to be you.',ev:'Self-serve once your domain is proved.',req:['manifest:dns']},
 {id:'egress',n:'Where your data goes',t:0,c:2,r:1,g:'route',csf:'ID.AM',d:'Records every host your app connects to and what it saves in the browser.',ev:'Part of the full application review.',req:['manifest:dns']},
 {id:'recon',n:'Internet exposure',t:1,c:1,r:0,g:'census',csf:'ID.RA',d:'Finds open services on the hosts you have recorded.',ev:'',req:['manifest:shadow','bridge:token']},
 {id:'verdict',n:'Verdict and retest',t:1,c:1,r:0,g:'brief',csf:'ID.RA',d:'A one-page verdict and a retest that closes each fixed finding.',ev:'',req:['tls','mail','code']},
 {id:'ai',n:'AI feature testing',t:1,c:2,r:0,g:'match',csf:'ID.RA',d:'Tests your chatbots and AI features for tricks that make them leak data or misbehave.',ev:'',req:['egress']},
 {id:'cloud',n:'Cloud and publishing accounts',t:2,c:1,r:0,g:'backup',csf:'ID.RA',d:'Reads the settings of the accounts that host and publish your app.',ev:'',req:['manifest:cloudacct','bridge:token']},
 {id:'regs',n:'Regulation mapping',t:2,c:2,r:0,g:'playbook',csf:'GV.OC',d:'Matches each finding to the rules that apply to you.',ev:'',req:['verdict']},
 {id:'cont',n:'Continuous assurance',t:3,c:0,r:0,g:'kev',csf:'ID.IM',d:'Runs every check on a schedule and retests every fix.',ev:'',req:['manifest:repo','verdict']},
 {id:'alarm',n:'Alarm test',t:3,c:2,r:0,g:'firewall',csf:'ID.IM',d:'Safe staged attack steps that show whether your alarms go off.',ev:'',req:['lookout:detect','bridge:token']}
]},
anchor:{name:'Anchor',side:'crew',spot:'#E0B43B',fn:'Protect',job:'Finds every account you hold and who can reset them.',branches:['Find','Understand','Fix'],skills:[
 {id:'census',n:'Account census',t:0,c:0,r:0,g:'census',csf:'PR.AA',d:'Finds every account you hold from your mailbox.',ev:'',req:['manifest:email']},
 {id:'dormant',n:'Dormant accounts',t:0,c:1,r:0,g:'dormant',csf:'PR.AA',d:'Finds accounts you have not touched in a long time.',ev:'',req:['census']},
 {id:'reset',n:'Reset paths',t:0,c:2,r:0,g:'reset',csf:'PR.AA',d:'Shows which account can reset the others.',ev:'',req:['census']},
 {id:'mfa',n:'Sign-in strength',t:1,c:1,r:0,g:'gate',csf:'PR.AA',d:'Which accounts still lack two-step sign-in or a passkey.',ev:'',req:['census']},
 {id:'close',n:'Guided clean-up',t:1,c:2,r:0,g:'shred',csf:'PR.AA',d:'Walks you to the close button of each dormant account. You press it.',ev:'',req:['dormant']},
 {id:'more',n:'More mailboxes',t:2,c:0,r:0,g:'mail',csf:'PR.AA',d:'Mail providers beyond the first.',ev:'',req:['census']},
 {id:'pw',n:'Breached passwords',t:2,c:1,r:0,g:'breach',csf:'PR.AA',d:'Flags accounts whose password appeared in a known breach.',ev:'',req:['census','fathom:breach']},
 {id:'watch',n:'Identity watch',t:3,c:1,r:0,g:'kev',csf:'PR.AA',d:'Keeps the census current and tells you when a new account or a new reset path appears.',ev:'',req:['census','reset']}
]},
fathom:{name:'Fathom',side:'crew',spot:'#7DD3B0',fn:'Identify',job:'Looks for your data where it has no business being.',branches:['Breaches','Brokers','Documents'],skills:[
 {id:'breach',n:'Breach lookup',t:0,c:0,r:0,g:'breach',csf:'ID.RA',d:'Checks whether your addresses appear in known breaches.',ev:'',req:['manifest:self']},
 {id:'broker',n:'Broker sweep',t:1,c:1,r:0,g:'broker',csf:'ID.RA',d:'Finds data brokers holding your details.',ev:''},
 {id:'docleak',n:'Document leaks',t:1,c:2,r:0,g:'docleak',csf:'ID.RA',d:'Looks for your documents in places they should not be.',ev:''},
 {id:'look',n:'Lookalike domains',t:2,c:0,r:0,g:'dns',csf:'ID.RA',d:'Finds domains registered to pass as yours.',ev:'',req:['manifest:dns']},
 {id:'remove',n:'Removal requests',t:2,c:1,r:0,g:'shred',csf:'ID.RA',d:'Drafts the removal request for each broker. You send it.',ev:'',req:['broker']},
 {id:'watch',n:'Footprint watch',t:3,c:1,r:0,g:'kev',csf:'ID.RA',d:'Repeats every sweep on a schedule and reports only what changed.',ev:'',req:['breach','broker','docleak']}
]},
lookout:{name:'Lookout',side:'crew',spot:'#C9A7F0',fn:'Detect',job:'Keeps an eye on your devices and the home network.',branches:['Devices','Network','Sign-ins'],skills:[
 {id:'device',n:'Device watch',t:0,c:0,r:0,g:'device',csf:'ID.AM',d:'Knows which devices are on your network.',ev:'',req:['manifest:device']},
 {id:'firewall',n:'Firewall check',t:0,c:1,r:0,g:'firewall',csf:'PR.IR',d:'Confirms the firewall on each machine and on the router is on.',ev:''},
 {id:'patch',n:'Patch state',t:1,c:0,r:0,g:'deps',csf:'PR.PS',d:'Which devices are behind on updates.',ev:'',req:['device']},
 {id:'login',n:'Login alerts',t:1,c:2,r:0,g:'login',csf:'DE.CM',d:'Tells you when someone signs in somewhere new.',ev:'',req:['anchor:census']},
 {id:'base',n:'Normal versus odd',t:2,c:1,r:0,g:'kev',csf:'DE.AE',d:'Learns what your network usually does and flags what does not fit.',ev:'',req:['firewall','device']},
 {id:'detect',n:'Detection across devices',t:3,c:1,r:0,g:'match',csf:'DE.AE',d:'Combines device and sign-in signals into one alert.',ev:'',req:['base','login']}
]},
harbour:{name:'Harbour',side:'crew',spot:'#F0A3B4',fn:'Respond, Recover',job:'Gets you back on your feet after a bad night.',branches:['Respond','Recover','Accounts'],skills:[
 {id:'play',n:'First-hour playbook',t:0,c:0,r:0,g:'playbook',csf:'RS.MA',d:'What to do in the first hour of the most common incidents.',ev:''},
 {id:'backup',n:'Backup check',t:0,c:1,r:0,g:'backup',csf:'PR.DS',d:'Confirms you have a recent backup stored somewhere else.',ev:''},
 {id:'drill',n:'Recovery drill',t:1,c:1,r:0,g:'drill',csf:'RC.RP',d:'Restores one thing from backup to prove it works.',ev:'',req:['backup']},
 {id:'kit',n:'Account recovery kit',t:1,c:2,r:0,g:'reset',csf:'RC.RP',d:'Offline codes and contacts to get back into your key accounts.',ev:'',req:['anchor:reset']},
 {id:'tell',n:'Who to tell',t:2,c:0,r:0,g:'mail',csf:'RS.CO',d:'Drafts the notices you must send and says by when.',ev:'',req:['play']},
 {id:'contain',n:'Contain it',t:2,c:0,r:0,g:'lock',csf:'RS.MI',d:'Steps that stop an incident spreading.',ev:'',req:['play']},
 {id:'whathappened',n:'What happened',t:2,c:0,r:0,g:'log',csf:'RS.AN',d:'Works out what happened and how far it went.',ev:'',req:['play']},
 {id:'allclear',n:'All clear',t:2,c:1,r:0,g:'mail',csf:'RC.CO',d:'Tells the people you warned that it is over.',ev:'',req:['tell']},
 {id:'guided',n:'Guided response',t:3,c:1,r:0,g:'route',csf:'RS.MA',d:'Walks you through a live incident step by step and keeps the record.',ev:'',req:['play','drill']}
]},
glass:{name:'Glass',side:'service',spot:'#6FA2F0',fn:'Identify',job:'Watches the lists of flaws attackers are using right now.',branches:['Sources','Judgement','Reach'],skills:[
 {id:'kev',n:'Exploited flaws watch',t:0,c:0,r:2,g:'kev',csf:'ID.RA',d:'Follows the list of flaws confirmed as used in real attacks.',ev:'Every morning.'},
 {id:'rebuild',n:'Record rebuild',t:0,c:1,r:2,g:'cve',csf:'ID.RA',d:'Fills in missing severity and product details and shows the source of each.',ev:'Every morning.'},
 {id:'digest',n:'Scored digest',t:0,c:2,r:2,g:'brief',csf:'ID.RA',d:'Ranks the day\'s flaws and publishes the top 250 with a reason for each.',ev:'Published every morning at wangreport.com/cve.',req:['kev','rebuild']},
 {id:'oss',n:'Open-source advisories',t:1,c:0,r:0,g:'deps',csf:'ID.RA',d:'Adds the advisory lists for open-source packages.',ev:'',req:['rebuild']},
 {id:'match',n:'Asset match',t:1,c:2,r:0,g:'match',csf:'ID.RA',d:'Only the flaws that touch what you actually run.',ev:'',req:['digest','squall:deps','manifest:stack']},
 {id:'eu',n:'More national sources',t:2,c:0,r:0,g:'log',csf:'ID.RA',d:'The EU vulnerability database and others beyond the US lists.',ev:'',req:['rebuild']},
 {id:'lens',n:'Your own watch list',t:2,c:1,r:0,g:'census',csf:'ID.RA',d:'Ranking tuned to your industry and your vendors.',ev:'',req:['digest']},
 {id:'alert',n:'Alert on match',t:2,c:2,r:0,g:'login',csf:'ID.RA',d:'One message when a flaw that touches you joins the exploited list.',ev:'',req:['match']},
 {id:'first',n:'Patch-first order',t:3,c:1,r:0,g:'route',csf:'ID.RA',d:'One ordered list of what to fix first across everything you run.',ev:'',req:['lens','alert']}
]},
bridge:{name:'Bridge',side:'service',spot:'#F5B26B',fn:'Govern',job:'Sends each request to the right agent and records why.',branches:['Routing','Permission','Record'],skills:[
 {id:'route',n:'Routing',t:0,c:0,r:1,g:'route',csf:'GV.OV',d:'Sends each request to the right agent or refuses it with a reason.',ev:'Not yet in the path of scheduled runs.'},
 {id:'gate',n:'Permission gate',t:0,c:1,r:1,g:'gate',csf:'GV.PO',d:'No job runs without a signed permission naming the target.',ev:''},
 {id:'log',n:'Decision log',t:0,c:2,r:2,g:'log',csf:'GV.OV',d:'One line for every request and every run.',ev:'Every scheduled run writes a line.'},
 {id:'chat',n:'Request surface',t:1,c:0,r:0,g:'mail',csf:'GV.OV',d:'A place to ask the fleet for a check.',ev:'',req:['route']},
 {id:'audit',n:'Auditor',t:1,c:2,r:0,g:'secret',csf:'GV.OV',d:'Reads the logs daily and flags anything out of scope or failed.',ev:'',req:['log']},
 {id:'cost',n:'Cost on every line',t:1,c:2,r:0,g:'cve',csf:'GV.OV',d:'Each log line carries how long the run took and how many AI calls it made.',ev:'',req:['log']},
 {id:'brief',n:'Monthly brief',t:2,c:0,r:0,g:'brief',csf:'GV.OV',d:'One page a month on what ran and what was found.',ev:'',req:['log','audit']},
 {id:'token',n:'Permission per action',t:2,c:1,r:0,g:'dns',csf:'GV.PO',d:'Every agent shows a signed token before each action.',ev:'',req:['gate']},
 {id:'chain',n:'Tamper-evident log',t:2,c:2,r:0,g:'lock',csf:'GV.OV',d:'Chains each log line to the last so any change shows.',ev:'',req:['log']},
 {id:'auto',n:'Unattended dispatch',t:3,c:1,r:0,g:'kev',csf:'GV.OV',d:'Routes requests on its own within signed limits.',ev:'',req:['token','chain','audit']}
]},
haze:{name:'Haze',side:'service',spot:'#9FB3CF',fn:'Protect',job:'Masks names and numbers before text leaves the room.',branches:['Mask','Gate','Seal'],skills:[
 {id:'mask',n:'Masking',t:0,c:0,r:2,g:'cloak',csf:'PR.DS',d:'Swaps names and numbers for consistent stand-ins.',ev:'On one internal source.'},
 {id:'gate',n:'Leak gate',t:0,c:1,r:2,g:'gate',csf:'PR.DS',d:'Drops any record that still holds something sensitive.',ev:'On one internal source.',req:['mask']},
 {id:'seal',n:'Seal and shred',t:0,c:2,r:2,g:'shred',csf:'PR.DS',d:'Everything sent is locked to one key. Destroy the key and nothing sent can be read again.',ev:'On one internal source. The kill switch has been tested.',req:['gate']},
 {id:'measure',n:'Measured miss rate',t:1,c:0,r:0,g:'kev',csf:'PR.DS',d:'A real number for how often masking misses something.',ev:'',req:['mask']},
 {id:'adapter',n:'Second source',t:1,c:1,r:0,g:'docleak',csf:'PR.DS',d:'Masks a second kind of record.',ev:'',req:['gate']},
 {id:'reid',n:'Re-identification test',t:2,c:0,r:0,g:'secret',csf:'PR.DS',d:'Measures how often masked text can be traced back to a person.',ev:'',req:['measure']},
 {id:'agents',n:'Outbound gate for agents',t:2,c:1,r:0,g:'route',csf:'PR.DS',d:'Everything any agent sends to an outside AI model passes through Haze first.',ev:'',req:['adapter','bridge:route']},
 {id:'policy',n:'Egress policy',t:3,c:1,r:0,g:'playbook',csf:'PR.DS',d:'Rules for what data may leave and to whom.',ev:'',req:['agents','reid']}
]}
};

/* what the site needs to draw an agent anywhere: cards, menu, sub-bar. Status lives here and nowhere else. */
var META={
 manifest:{role:'The record of what you own',st:'live',label:'live',tl:[.5,.4],href:'manifest/index.html',csfl:'NIST CSF 2.0: Identify. Assets.'},
 squall:{role:'Checks sites and code',st:'live',label:'live',tl:[.58,.33],href:'squall/index.html',csfl:'NIST CSF 2.0: Identify. Assurance.',ph:['Your app and its code','AI and the internet edge','Accounts and cloud','Your defences']},
 anchor:{role:'Accounts and identity',st:'designed',label:'designed',tl:[.47,.44],href:'anchor/index.html',csfl:'NIST CSF 2.0: Protect. Identity.'},
 fathom:{role:'Your data footprint',st:'planned',label:'planned',tl:[.58,.60],href:'fathom/index.html',csfl:'NIST CSF 2.0: Identify. Footprint.'},
 lookout:{role:'Devices and home network',st:'planned',label:'planned',tl:[.56,.09],href:'lookout/index.html',csfl:'NIST CSF 2.0: Detect.'},
 harbour:{role:'Respond and recover',st:'planned',label:'planned',tl:[.82,.60],href:'harbour/index.html',csfl:'NIST CSF 2.0: Respond and Recover.'},
 glass:{role:'Threat intelligence',st:'live',label:'live',tl:[.47,.42],href:'glass/index.html',csfl:'NIST CSF 2.0: Identify. Threat intelligence.'},
 bridge:{role:'Routing and the decision log',st:'live',label:'live',tl:[.76,.22],href:'bridge/index.html',csfl:'NIST CSF 2.0: Govern.'},
 haze:{role:'Masks what leaves the wall',st:'built',label:'built',tl:[.57,.36],href:'haze/index.html',csfl:'NIST CSF 2.0: Protect. Data.'}
};
ORDER.forEach(function(k){for(var m in META[k])A[k][m]=META[k][m];A[k].id=k;});
function pts(a){var p=0;a.skills.forEach(function(s){p+=s.r;});return [p,a.skills.length*MAX];}
function svg(g){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(G[g]||G.kev)+'</svg>';}
function pips(r){var h='';for(var i=1;i<=MAX;i++)h+='<i class="'+(i<=r?'on':'')+'"></i>';return '<span class="sk-pips" aria-hidden="true">'+h+'</span>';}
function find(aid,ref){var p=ref.split(':');var ag=p.length>1?p[0]:aid,id=p[p.length-1];var s=A[ag].skills.filter(function(x){return x.id===id;})[0];return {ag:ag,s:s};}

function tree(root,aid,base){
  var a=A[aid],P=pts(a);
  var h='<div class="sk-head"><div><h1>'+a.name+' skill tree</h1><p class="sk-job">'+a.job+'</p></div>'+
    '<div class="sk-score"><b>'+P[0]+'</b><span>of '+P[1]+' skill points</span><div class="sk-bar"><i style="width:'+(P[0]/P[1]*100)+'%"></i></div><small>NIST CSF 2.0: '+a.fn+'</small></div></div>'+
    '<div class="sk-cols"><div class="sk-tree" id="sk-tree"><svg class="sk-lines" id="sk-lines" aria-hidden="true"></svg>'+
    '<div class="sk-branches">'+a.branches.map(function(b){return '<span>'+b+'</span>';}).join('')+'</div>';
  /* rows by maturity, most mature first. World class always shows: it is the target */
  for(var t=MAX;t>=0;t--){
    var used=[0,0,0], L=a.skills.filter(function(s){return s.r===t;});
    if(!L.length&&t!==MAX)continue;
    h+='<div class="sk-tier r'+t+'"><div class="sk-tl"><b>'+pips(t)+RANK[t]+'</b><span>'+RANKD[t]+'</span></div><div class="sk-grid">'+(L.length?'':'<p class="sk-none">No skill is here yet.</p>');
    L.sort(function(x,y){return x.t-y.t;}).forEach(function(s){
      used[s.c]++;
      h+='<button type="button" class="sk-node r'+s.r+'" data-id="'+s.id+'" style="grid-column:'+(s.c+1)+';grid-row:'+used[s.c]+'" aria-label="'+s.n+', '+RANK[s.r]+'">'+
        '<span class="sk-ic">'+svg(s.g)+'<em>'+s.r+'/'+MAX+'</em></span><span class="sk-n">'+s.n+'</span></button>';
    });
    h+='</div></div>';
  }
  h+='</div><aside class="sk-detail" id="sk-detail" aria-live="polite"></aside></div><div class="sk-back" id="sk-backdrop"></div>';
  root.innerHTML=h;
  var det=document.getElementById('sk-detail'),bd=document.getElementById('sk-backdrop');
  function show(id,open){
    var s=a.skills.filter(function(x){return x.id===id;})[0]; if(!s)return;
    root.querySelectorAll('.sk-node').forEach(function(n){n.classList.toggle('sel',n.getAttribute('data-id')===id);});
    var needs=(s.req||[]).map(function(r){var f=find(aid,r);return f.ag===aid?'<button type="button" data-go="'+f.s.id+'">'+f.s.n+' '+f.s.r+'/'+MAX+'</button>':'<a href="'+base+f.ag+'/skills.html#'+f.s.id+'">'+A[f.ag].name+': '+f.s.n+' '+f.s.r+'/'+MAX+'</a>';});
    var opens=a.skills.filter(function(x){return (x.req||[]).indexOf(s.id)>-1;}).map(function(x){return '<button type="button" data-go="'+x.id+'">'+x.n+'</button>';});
    det.innerHTML='<button type="button" class="sk-x" aria-label="Close">×</button>'+
      '<div class="sk-dt"><span class="sk-ic r'+s.r+'">'+svg(s.g)+'</span><div><h3>'+s.n+'</h3><div class="sk-rk">'+pips(s.r)+'<b>'+RANK[s.r]+'.</b> '+RANKD[s.r]+'</div></div></div>'+
      '<p>'+s.d+'</p>'+
      '<dl>'+(s.ev?'<dt>Today</dt><dd>'+s.ev+'</dd>':'')+
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
      else if(B1.bottom<A1.top-4){var ya=A1.top-b.top,yb=B1.bottom-b.top,mm=yb+12;d='M'+x1+' '+ya+'V'+mm+'H'+x2+'V'+yb;}
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
    return '<a class="sk-card" href="'+base+id+'/skills.html" style="--spot:'+a.spot+'"><img class="crewimg'+(a.skills.some(function(s){return s.r>0;})?'':' off')+'" src="'+base+'fleet/crew/'+id+'.png" alt="" loading="lazy">'+
      '<div><h3>'+a.name+'</h3><p>'+a.job+'</p><div class="sk-bar"><i style="width:'+(P[0]/P[1]*100)+'%"></i></div>'+
      '<small><b>'+P[0]+' of '+P[1]+'</b> points · '+live+' of '+a.skills.length+' skills built · CSF '+a.fn+'</small></div></a>';}
  var tot=[0,0];ORDER.forEach(function(id){var P=pts(A[id]);tot[0]+=P[0];tot[1]+=P[1];});
  var crew=ORDER.filter(function(i){return A[i].side==='crew';}),serv=ORDER.filter(function(i){return A[i].side==='service';});
  root.innerHTML='<div class="sk-head"><div><h1>Fleet skill trees</h1></div>'+
    '<div class="sk-score"><b>'+tot[0]+'</b><span>of '+tot[1]+' skill points</span><div class="sk-bar"><i style="width:'+(tot[0]/tot[1]*100)+'%"></i></div><small>across '+(['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'][ORDER.length]||ORDER.length)+' agents</small></div></div>'+
    '<div class="sk-legend">'+RANK.map(function(r,i){return '<span>'+pips(i)+'<b>'+r+'</b> '+RANKD[i]+'</span>';}).join('')+'</div>'+
    '<h2 class="sk-h2">The crew</h2><p class="sk-sub">Each one checks something of yours.</p><div class="sk-cards">'+crew.map(card).join('')+'</div>'+
    '<h2 class="sk-h2">Fleet services</h2><p class="sk-sub">They support the crew.</p><div class="sk-cards">'+serv.map(card).join('')+'</div>';
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
/* agent pages: the kit is the tier 0 skills */
function kit(root,aid){
  root.innerHTML=t0(A[aid]).map(function(s){return '<div class="kc'+(s.r>0?'':' off')+'"><span class="item" aria-hidden="true">'+svg(s.g)+'</span><b>'+s.n+'</b><span class="d">'+s.d+'</span></div>';}).join('');
}
/* agent pages: the phases are the tiers. from=1 leaves tier 0 out (it is the kit) */
function phases(root,aid,style,from){
  var a=A[aid],h='';
  for(var t=from||0;t<4;t++){var L=a.skills.filter(function(s){return s.t===t;}); if(!L.length)continue;
    var now=t===0, title=a.ph?a.ph[t]:'';
    if(style==='road') h+='<div class="step'+(now?' now':'')+'"><span class="dot"></span><h3>'+(t<3?'Phase '+t:'End game')+'</h3><p class="sub">'+(now?'Now':title)+'</p><ul>'+L.map(function(s){return '<li>'+s.n+'<small>'+s.d+'</small></li>';}).join('')+'</ul></div>';
    else h+='<div class="ph'+(now?' now':'')+'"><span class="k"><i></i>'+TIER[t]+'</span>'+(title?'<h3>'+title+'</h3>':'')+'<ul>'+L.map(function(s){return '<li>'+s.n+'</li>';}).join('')+'</ul></div>';
  }
  root.innerHTML=h;
}
/* overview flow: icons and names of the skills that work today (a skill flagged enrol:true is a step of its own in the flow, so it is not listed here) */
function runs(root,aid){
  root.innerHTML=A[aid].skills.filter(function(s){return s.r>0&&!s.enrol;}).map(function(s){return '<span class="rn"><span class="ri">'+svg(s.g)+'</span>'+s.n+'</span>';}).join('');
}
function run(){
  document.querySelectorAll('[data-sk]').forEach(function(el){
    var k=el.getAttribute('data-sk'),ag=el.getAttribute('data-agent'),base=el.getAttribute('data-base')||'';
    if(k==='tree')tree(el,ag,base); else if(k==='overview')overview(el,base);
    else if(k==='cards')cards(el,base,el.getAttribute('data-side')); else if(k==='kit')kit(el,ag); else if(k==='runs')runs(el,ag);
    else if(k==='phases')phases(el,ag,el.getAttribute('data-style'),+el.getAttribute('data-from')||0);
  });
}
window.TF_SKILLS={agents:A,order:ORDER,points:pts};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
