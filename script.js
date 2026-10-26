const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const nameInput = $('#nameInput'), partnerInput = $('#partnerInput');
let category = 'all', language = 'bn', toastTimer;

const maps = {
  bold: {'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭','a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁','u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇'},
  italic: {'A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡','a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫','k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵','u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻'},
  script: {'A':'𝓐','B':'𝓑','C':'𝓒','D':'𝓓','E':'𝓔','F':'𝓕','G':'𝓖','H':'𝓗','I':'𝓘','J':'𝓙','K':'𝓚','L':'𝓛','M':'𝓜','N':'𝓝','O':'𝓞','P':'𝓟','Q':'𝓠','R':'𝓡','S':'𝓢','T':'𝓣','U':'𝓤','V':'𝓥','W':'𝓦','X':'𝓧','Y':'𝓨','Z':'𝓩','a':'𝓪','b':'𝓫','c':'𝓬','d':'𝓭','e':'𝓮','f':'𝓯','g':'𝓰','h':'𝓱','i':'𝓲','j':'𝓳','k':'𝓴','l':'𝓵','m':'𝓶','n':'𝓷','o':'𝓸','p':'𝓹','q':'𝓺','r':'𝓻','s':'𝓼','t':'𝓽','u':'𝓾','v':'𝓿','w':'𝔀','x':'𝔁','y':'𝔂','z':'𝔃'},
  fraktur: {'A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔑','O':'𝔒','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'ℨ','a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷'}
};
const tiny = {'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ','A':'ᴬ','B':'ᴮ','D':'ᴰ','E':'ᴱ','G':'ᴳ','H':'ᴴ','I':'ᴵ','J':'ᴶ','K':'ᴷ','L':'ᴸ','M':'ᴹ','N':'ᴺ','O':'ᴼ','P':'ᴾ','R':'ᴿ','T':'ᵀ','U':'ᵁ','V':'ⱽ','W':'ᵂ'};
const stylize = (s, map) => [...s].map(c => map[c] || c).join('');
const getBase = () => {
  const name = nameInput.value.trim() || (language === 'bn' ? 'তোমার নাম' : 'Your Name');
  const partner = partnerInput.value.trim();
  return partner ? name + ($('#separator').value) + partner : name;
};
function buildStyles(){
  const raw = getBase();
  const prefix = $('#prefixInput').value, suffix = $('#suffixInput').value;
  const isCouple = !!partnerInput.value.trim();
  let items = [
    ['fancy','𝓢𝓽𝔂𝓵𝓮 01',stylize(raw,maps.script)],
    ['fancy','𝔉𝔯𝔞𝔨𝔱𝔲𝔯',stylize(raw,maps.fraktur)],
    ['italic','Italic',stylize(raw,maps.italic)],
    ['bold','Bold',stylize(raw,maps.bold)],
    ['tiny','Tiny',stylize(raw,tiny)],
    ['love','Love',`♡ ${raw} ♡`],
    ['love','Butterfly',`꧁ ${raw} 🦋 ꧂`],
    ['gaming','Gamer',`亗 ${raw} 亗`],
    ['gaming','Royal',`♛ ${raw} ♛`],
    ['gaming','Shadow',`乂 ${raw} 乂`],
    ['fancy','Star',`✦ ${raw} ✦`],
    ['love','Cute',`ᥫ᭡ ${raw} ᥫ᭡`],
    ['gaming','Pro',`么 ${raw} 么`],
    ['fancy','Diamond',`◇ ${raw} ◇`],
    ['love','Hearts',`♥ ${raw} ♥`],
    ['fancy','Sparkle',`༄ ${raw} ༄`]
  ];
  if(category !== 'all') items = items.filter(x => category === 'fancy' ? ['fancy','italic'].includes(x[0]) : x[0] === category);
  return items.map(([cat,label,text]) => ({cat,label,text:prefix+text+suffix}));
}
function render(){
  const results = buildStyles();
  $('#results').innerHTML = '';
  results.forEach((item,i) => {
    const card = document.createElement('div'); card.className='result-card';
    const name = document.createElement('div'); name.className='result-name'; name.textContent=item.text;
    const btn = document.createElement('button'); btn.className='copy-btn'; btn.type='button'; btn.textContent=language==='bn'?'কপি':'Copy';
    btn.addEventListener('click',()=>copyText(item.text));
    card.append(name,btn); $('#results').append(card);
  });
  $('#resultCount').textContent = `${results.length} ${language==='bn'?'টি স্টাইল':'styles'}`;
}
async function copyText(text){
  try{
    if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    else {
      const area=document.createElement('textarea'); area.value=text; area.style.position='fixed'; area.style.opacity='0'; document.body.append(area); area.select();
      const ok=document.execCommand('copy'); area.remove(); if(!ok) throw new Error('copy failed');
    }
    showToast(language==='bn'?'কপি হয়েছে! ✨':'Copied! ✨');
  }catch(e){showToast(language==='bn'?'কপি হয়নি—নামটি সিলেক্ট করে কপি করো':'Could not copy — select the name and copy manually');}
}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1900);}
$$('.tab').forEach(btn=>btn.addEventListener('click',()=>{$$('.tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');category=btn.dataset.category;render();}));
[nameInput,partnerInput,$('#separator'),$('#prefixInput'),$('#suffixInput')].forEach(el=>el.addEventListener('input',render));
$('#refreshBtn').addEventListener('click',render);
$('#langToggle').addEventListener('click',()=>{
  language=language==='bn'?'en':'bn'; document.documentElement.lang=language;
  $$('[data-bn][data-en]').forEach(el=>el.textContent=el.dataset[language]);
  $('#langToggle').textContent=language==='bn'?'বাংলা / EN':'EN / বাংলা';
  $('#refreshBtn').querySelector('span').textContent=language==='bn'?'আবার তৈরি করো':'Regenerate names';
  render();
});
render();
