import { APP_VERSION, BEHAVIOR_ITEMS, DAYS_OPTIONS, DURATION_OPTIONS, FREQUENCY_OPTIONS, HEALTH_DURATION_OPTIONS, THRESHOLDS, calculateDslq, getHealthItems, normalizeHealthDuration } from "./scoring.js";

const screens = [...document.querySelectorAll(".screen")];
const state = { sessionId: crypto.randomUUID(), dogSex: "", behaviorAnswers: {}, behaviorIndex: 0, healthDurations: {}, healthIndex: 0, consent: false, dogDemographics: {} };

const BAND_LABELS = { normal:"Normal", elevated:"Elevated", high:"High", ultra_high:"Extremely High" };
const BAND_COPY = {
  normal:"Your dog's chronic stress score falls within the normal range relative to the current reference sample. This does not rule out stress in specific situations, but it suggests that chronic stress-related signs are not elevated overall compared to other dogs who have been evaluated in this assessment to date.",
  elevated:"Your dog's chronic stress score is elevated relative to the current reference sample, meaning that the stress score is slightly higher than the average score of dogs that have been evaluated with this assessment to date. It may be worth taking a closer look at your dog's daily routine, environment, health, and opportunities to meet key needs, and considering a consultation with a qualified dog behavior or welfare professional if concerns persist.",
  high:"Your dog's chronic stress score is high relative to the current reference sample, meaning that the stress score is higher than the average score of dogs that have been evaluated with this assessment to date. It may be especially important to review their daily routine, environment, health, and opportunities to meet key needs, and to discuss any concerns with a qualified dog behavior or welfare professional.",
  ultra_high:"Your dog's chronic stress score is higher than for most dogs, meeting or exceeding the highest values observed in the current reference sample. Talking to your veterinarian about possible sources of stress and reviewing the reported behaviors and your dog's daily activities with a qualified dog behavior or welfare professional is strongly recommended.",
};
const HEALTH_LABELS = { 1:"coat / skin changes",2:"weight loss",3:"body or breath odor changes",4:"gastrointestinal issues",5:"reproductive-related changes",6:"reproductive-related changes" };

function showScreen(id) { screens.forEach((screen)=>screen.classList.toggle("hidden",screen.id!==id)); window.scrollTo({top:0,behavior:"smooth"}); document.getElementById(id).focus({preventScroll:true}); }
function optionMarkup(name, value, label, checked=false) { return `<label><input type="radio" name="${name}" value="${value}" ${checked?"checked":""}><span>${label}</span></label>`; }
function selectMarkup(id, label, options, selected, placeholder="") { return `<div class="field"><label for="${id}">${label}</label><select id="${id}">${placeholder?`<option value="">${placeholder}</option>`:""}${options.map(([value,text])=>`<option value="${value}" ${Number(selected)===value?"selected":""}>${text}</option>`).join("")}</select></div>`; }

function healthItems() { return getHealthItems(state.dogSex); }
function totalQuestions() { return BEHAVIOR_ITEMS.length + healthItems().length; }

function renderBehavior() {
  const item=BEHAVIOR_ITEMS[state.behaviorIndex]; const existing=state.behaviorAnswers[item.key];
  document.getElementById("behavior-progress-copy").textContent=`Question ${state.behaviorIndex+1} of ${totalQuestions()}`;
  document.getElementById("behavior-answered-copy").textContent=`${Object.keys(state.behaviorAnswers).length} answered`;
  document.getElementById("behavior-progress-bar").style.width=`${((state.behaviorIndex+1)/totalQuestions())*100}%`;
  document.getElementById("behavior-code").textContent=`Behavior item ${item.number}`;
  document.getElementById("behavior-question").textContent=item.text;
  document.getElementById("behavior-back").disabled=state.behaviorIndex===0;
  document.getElementById("behavior-error").classList.add("hidden");
  const selected=item.type==="protective"?existing:existing?.main;
  document.getElementById("behavior-main").innerHTML=optionMarkup("behavior-main-answer",1,"Yes",selected===1)+optionMarkup("behavior-main-answer",2,"No",selected===2);
  const followups=document.getElementById("behavior-followups");
  const drawFollowups=()=>{
    const yes=document.querySelector('input[name="behavior-main-answer"]:checked')?.value==="1";
    followups.classList.toggle("hidden",item.type!=="symptom"||!yes);
    if(item.type==="symptom"&&yes){ const current=state.behaviorAnswers[item.key]||{}; followups.innerHTML=selectMarkup("frequency","How often does this happen within a day?",FREQUENCY_OPTIONS,current.frequency||1)+selectMarkup("days","On how many days per week does this typically happen?",DAYS_OPTIONS,current.daysPerWeek||1)+selectMarkup("duration","When did you first notice this?",DURATION_OPTIONS,current.duration||2); }
  };
  document.querySelectorAll('input[name="behavior-main-answer"]').forEach((input)=>input.addEventListener("change",drawFollowups)); drawFollowups();
}

function readBehavior() {
  const item=BEHAVIOR_ITEMS[state.behaviorIndex]; const selected=Number(document.querySelector('input[name="behavior-main-answer"]:checked')?.value);
  if(!selected) return false;
  state.behaviorAnswers[item.key]=item.type==="protective"?selected:selected===2?{main:2}:{main:1,frequency:Number(document.getElementById("frequency").value),daysPerWeek:Number(document.getElementById("days").value),duration:Number(document.getElementById("duration").value)};
  return true;
}

function renderHealth(){
  const items=healthItems(); const item=items[state.healthIndex]; const previous=state.healthDurations[item.code];
  const displayNumber=BEHAVIOR_ITEMS.length+state.healthIndex+1;
  document.getElementById("health-progress-copy").textContent=`Question ${displayNumber} of ${totalQuestions()}`;
  document.getElementById("health-progress-bar").style.width=`${(displayNumber/totalQuestions())*100}%`;
  document.getElementById("health-question").textContent=item.text;
  document.getElementById("health-back").disabled=false;
  document.getElementById("health-error").classList.add("hidden");
  document.getElementById("health-main").innerHTML=optionMarkup("health-main-answer",1,"Yes",previous!==undefined&&previous!==-1)+optionMarkup("health-main-answer",2,"No",previous===-1);
  const followup=document.getElementById("health-followup");
  const draw=()=>{ const yes=document.querySelector('input[name="health-main-answer"]:checked')?.value==="1"; followup.classList.toggle("hidden",!yes); if(yes) followup.innerHTML=selectMarkup("health-duration","When did you first observe this?",HEALTH_DURATION_OPTIONS,previous===undefined?"":previous,"Select one"); };
  document.querySelectorAll('input[name="health-main-answer"]').forEach((input)=>input.addEventListener("change",draw)); draw();
}

function readHealth(){ const item=healthItems()[state.healthIndex]; const selected=Number(document.querySelector('input[name="health-main-answer"]:checked')?.value); if(!selected)return false; if(selected===2){state.healthDurations[item.code]=-1;return true;} const duration=Number(document.getElementById("health-duration").value); if(!duration)return false; state.healthDurations[item.code]=normalizeHealthDuration(duration);return true; }

function getDemographics(){ const data=new FormData(document.getElementById("demographics-form")); const out={dog_sex:state.dogSex}; for(const [key,value] of data.entries()){ if(String(value).trim()!=="") out[key]=["dog_age_years","dog_age_months","dogs_in_household"].includes(key)?Number(value):String(value).trim(); } return out; }

function healthResultHtml(){ const groups={3:[],2:[],1:[]}; for(const [code,duration] of Object.entries(state.healthDurations)){ if(duration!==-1&&!groups[duration].includes(HEALTH_LABELS[code])) groups[duration].push(HEALTH_LABELS[code]); } if(!Object.values(groups).some((values)=>values.length)) return ""; let html="<p>Some health issues you mentioned may be associated with chronic stress: they can both reflect it and contribute to it.</p>"; if(groups[3].length)html+=`<p><strong>Present for over a month:</strong> ${groups[3].join(", ")}. These signs have been present for a relatively long time and may be more strongly associated with chronic stress. We recommend reviewing these results with your veterinarian and a behavior or welfare professional for additional guidance.</p>`; if(groups[2].length)html+=`<p><strong>First observed less than a month ago:</strong> ${groups[2].join(", ")}. These signs may be either symptoms of chronic stress or factors contributing to it. If your veterinarian has not identified a medical cause, a consultation with a behavior or welfare professional may also be helpful.</p>`; if(groups[1].length)html+=`<p><strong>First noticed within the past week, or varying in timing:</strong> ${groups[1].join(", ")}. These signs may be recent or inconsistent, but they can still matter. If these signs are new, persistent, or worsening, or if you have new or worsening concerns about any of them, a veterinary check and consultation with behavior or welfare professional may be warranted.</p>`; return html; }

function renderResult(result){ document.getElementById("score-number").textContent=result.total.toFixed(2); const badge=document.getElementById("band-badge"); badge.className=`band-badge band-${result.band}`; badge.textContent=BAND_LABELS[result.band]; document.getElementById("band-copy").textContent=BAND_COPY[result.band]; document.getElementById("scale-value").textContent=`Score ${result.total.toFixed(2)} of ${THRESHOLDS.maxObserved}`; document.getElementById("scale-marker").style.left=`${result.scalePos*100}%`; const healthHtml=healthResultHtml(); document.getElementById("health-result").classList.toggle("hidden",!healthHtml); document.getElementById("health-copy").innerHTML=healthHtml; }

async function saveResponse(result){ const status=document.getElementById("save-status"); status.className="status";status.textContent="Saving the information you agreed to share…"; try{ const response=await fetch("/api/sessions",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({sessionId:state.sessionId,appVersion:APP_VERSION,consent:true,dogSex:state.dogSex,behaviorAnswers:state.behaviorAnswers,healthDurations:state.healthDurations,dogDemographics:state.dogDemographics})}); if(!response.ok)throw new Error(); const saved=await response.json(); if(saved.result.total!==result.total||saved.result.band!==result.band)throw new Error();status.textContent="Thank you—the information you agreed to share was saved for research.";}catch{status.classList.add("warning");status.textContent="Your result was calculated, but the research copy could not be saved. No action is required from you.";} }

async function finish(){ const result=calculateDslq(state.dogSex,state.behaviorAnswers,state.healthDurations);renderResult(result);document.getElementById("save-status").classList.add("hidden");showScreen("result-screen");if(state.consent)await saveResponse(result); }

document.getElementById("start-button").addEventListener("click",()=>showScreen("sex-screen"));
document.getElementById("sex-next").addEventListener("click",()=>{const sex=document.querySelector('input[name="dog-sex"]:checked')?.value;if(!sex){document.getElementById("sex-error").classList.remove("hidden");return;}state.dogSex=sex;state.behaviorIndex=0;renderBehavior();showScreen("behavior-screen");});
document.getElementById("behavior-form").addEventListener("submit",(event)=>{event.preventDefault();if(!readBehavior()){document.getElementById("behavior-error").classList.remove("hidden");return;}if(state.behaviorIndex<BEHAVIOR_ITEMS.length-1){state.behaviorIndex++;renderBehavior();}else{state.healthIndex=0;renderHealth();showScreen("health-screen");}});
document.getElementById("behavior-back").addEventListener("click",()=>{if(state.behaviorIndex>0){state.behaviorIndex--;renderBehavior();}});
document.getElementById("health-form").addEventListener("submit",(event)=>{event.preventDefault();if(!readHealth()){document.getElementById("health-error").classList.remove("hidden");return;}if(state.healthIndex<healthItems().length-1){state.healthIndex++;renderHealth();}else showScreen("consent-screen");});
document.getElementById("health-back").addEventListener("click",()=>{if(state.healthIndex>0){state.healthIndex--;renderHealth();}else{state.behaviorIndex=BEHAVIOR_ITEMS.length-1;renderBehavior();showScreen("behavior-screen");}});
document.getElementById("consent-back").addEventListener("click",()=>{state.healthIndex=healthItems().length-1;renderHealth();showScreen("health-screen");});
document.getElementById("consent-next").addEventListener("click",async()=>{const consent=document.querySelector('input[name="consent"]:checked')?.value;if(!consent){document.getElementById("consent-error").classList.remove("hidden");return;}state.consent=consent==="yes";if(state.consent)showScreen("demographics-screen");else await finish();});
document.getElementById("demographics-back").addEventListener("click",()=>showScreen("consent-screen"));
document.getElementById("demographics-form").addEventListener("submit",async(event)=>{event.preventDefault();state.dogDemographics=getDemographics();await finish();});
document.getElementById("restart-button").addEventListener("click",()=>window.location.reload());
