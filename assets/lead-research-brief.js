(function(){
  const form=document.querySelector('#research-form');
  if(!form)return;
  const $=id=>document.getElementById(id);
  const empty=$('brief-empty'),result=$('brief-result'),copyButton=$('copy-brief'),downloadButton=$('download-brief'),status=$('brief-status');
  let plainText='';
  const value=id=>$(id).value.trim();
  const setText=(id,text)=>{$(id).textContent=text};
  function buildBrief(){
    const company=value('company'),role=value('role'),signal=value('signal'),source=value('source'),context=value('context');
    const fit=context
      ? 'Possible connection to explore: '+context+' Compare this context with the observed signal before treating it as relevant. This is a hypothesis, not evidence of buying intent.'
      : 'No product or problem context was supplied. Add a specific problem your product addresses before judging whether this signal is relevant.';
    const opener='I noticed '+signal+' at '+company+'. I am not sure whether this connects to your current priorities, but '+(context?'we work on '+context+';':'I would be glad to understand whether this is relevant to your team.')+' Would a short exchange be useful, or is this not a focus right now?';
    setText('brief-company',company);
    setText('brief-role',role?'Possible contact: '+role:'Role or team not specified');
    setText('brief-signal',signal);
    setText('brief-source',source||'No source URL added. Locate and verify the original public source before using this brief.');
    setText('brief-fit',fit);
    setText('brief-opener',opener);
    plainText=[
      'LEADGENLAB · LOCAL LEAD RESEARCH BRIEF',
      'DRAFT — VERIFY BEFORE USE',
      '',
      'Company / account: '+company,
      'Role / team: '+(role||'Not specified'),
      '',
      '01 / OBSERVED SIGNAL',
      signal,
      '',
      '02 / SOURCE TO CHECK',
      source||'No source URL added. Locate and verify the original public source before using this brief.',
      '',
      '03 / POSSIBLE RELEVANCE',
      fit,
      '',
      '04 / A HUMAN-REVIEWED OPENER',
      opener,
      '',
      'BEFORE ANY OUTREACH',
      '- Open the source yourself and confirm the detail, date, and context.',
      '- Decide whether the role and problem connection are genuinely relevant.',
      '- Check contact accuracy, permissions, and applicable outreach rules.',
      '- Edit the draft in your own voice. Do not present an inference as a fact.',
      '',
      'This browser-only drafting aid makes no AI/API request, does not fetch or verify URLs, and does not save or send inputs.'
    ].join('\n');
    empty.hidden=true;
    result.hidden=false;
    copyButton.disabled=false;
    downloadButton.disabled=false;
    status.textContent='Brief assembled in this page only. Nothing has been saved or sent.';
  }
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;buildBrief()});
  form.addEventListener('reset',()=>{window.setTimeout(()=>{result.hidden=true;empty.hidden=false;plainText='';copyButton.disabled=true;downloadButton.disabled=true;status.textContent='No input is stored when you leave this page.'},0)});
  copyButton.addEventListener('click',async()=>{
    if(!plainText)return;
    try{await navigator.clipboard.writeText(plainText);status.textContent='Brief copied to your clipboard.'}
    catch{
      const scratch=document.createElement('textarea');scratch.value=plainText;scratch.setAttribute('readonly','');scratch.style.position='fixed';scratch.style.opacity='0';document.body.appendChild(scratch);scratch.select();
      const copied=document.execCommand('copy');scratch.remove();status.textContent=copied?'Brief copied to your clipboard.':'Copy is unavailable here. Select the visible brief and copy it.';
    }
  });
  downloadButton.addEventListener('click',()=>{
    if(!plainText)return;
    const file=new Blob([plainText],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(file),anchor=document.createElement('a');
    anchor.href=url;anchor.download='lead-research-brief.txt';document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
    status.textContent='Plain-text brief downloaded. The downloaded file is on your device.';
  });
})();