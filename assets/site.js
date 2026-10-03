(function(){
  const consentKey='lgl-consent';
  const root=document.body.dataset.root||'';
  document.querySelectorAll('.footer .brand-logo').forEach(logo=>{logo.src=root+'assets/leadgenlab-logo-light.svg'});
  const redesign=document.createElement('link');
  redesign.rel='stylesheet';
  redesign.href=root+'assets/site-redesign.css';
  document.head.appendChild(redesign);
  const topline=document.querySelector('.topline');
  if(topline){const tail=[...topline.childNodes].find(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim());if(tail)tail.textContent=' · Public signals, researched with care'}
  const primaryNav=document.querySelector('.navlinks');
  if(primaryNav){
    const navigation=[
      ['Workflows','workflows/index.html'],
      ['Field notes','insights/index.html'],
      ['Guides','guides/index.html'],
      ['AI updates','ai-updates/index.html'],
      ['About','about/index.html'],
      ['Research brief','tools/lead-research-brief.html'],
      ['Talk with Het','contact/index.html','mobile-contact-link']
    ];
    const links=navigation.map(([label,path,className])=>{
      const link=document.createElement('a');
      link.href=root+path;
      link.textContent=label;
      if(className)link.className=className;
      if(location.pathname.endsWith('/'+path))link.setAttribute('aria-current','page');
      return link;
    });
    primaryNav.replaceChildren(...links);
  }
  const navCta=document.querySelector('.nav-actions .button.solid');
  if(navCta){
    navCta.href=root+'workflows/lead-research-loop.html';
    navCta.replaceChildren(document.createTextNode('Try the workflow '));
    const arrow=document.createElement('span');
    arrow.className='arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';
    navCta.append(arrow);
  }
  const footer=document.querySelector('.footer');
  if(footer){
    const blurb=footer.querySelector('.footer-blurb');
    if(blurb)blurb.textContent='Practical, source-aware lead research and human-reviewed outreach for lean teams.';
    const columns=footer.querySelectorAll('.footer-col');
    if(columns[0]?.querySelector('strong'))columns[0].querySelector('strong').textContent='Explore';
    if(columns[1]?.querySelector('strong'))columns[1].querySelector('strong').textContent='Connect';
    const footerTagline=footer.querySelector('.footer-bottom span:last-child');
    if(footerTagline)footerTagline.textContent='Research it · Make it relevant · Keep a human in the loop';
  }
  const researchToolLink=document.createElement('a');
  researchToolLink.href=root+'tools/lead-research-brief.html';
  researchToolLink.className='button lime';
  researchToolLink.innerHTML='Build a research brief <span class="arrow" aria-hidden="true">↗</span>';
  if(document.querySelector('.home-hero-actions'))document.querySelector('.home-hero-actions').append(researchToolLink);
  if(location.pathname.includes('/workflows/lead-research-loop.html')){
    const callout=document.querySelector('.field-callout');
    if(callout){const link=researchToolLink.cloneNode(true);link.classList.add('research-brief-cta');link.setAttribute('aria-label','Open the local lead research brief tool');callout.append(link)}
  }
  if(location.pathname.endsWith('/tools/')||location.pathname.endsWith('/tools/index.html')){
    const hero=document.querySelector('.page-hero');
    if(hero){const link=researchToolLink.cloneNode(true);link.classList.add('research-brief-cta');hero.append(link)}
  }
  function track(name,details={}){
    if(localStorage.getItem(consentKey)!=='analytics')return;
    const event={event:name, ...details};
    window.dispatchEvent(new CustomEvent('leadgenlab:measurement',{detail:event}));
    if(Array.isArray(window.dataLayer))window.dataLayer.push(event);
    if(typeof window.gtag==='function')window.gtag('event',name,details);
  }
  const nav=document.querySelector('.navlinks'), menu=document.querySelector('.menu-btn');
  if(menu&&nav)menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
  if(nav)nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');if(menu)menu.setAttribute('aria-expanded','false')}));
  const overlay=document.querySelector('.search-overlay'), openSearch=document.querySelector('[data-search-open]'), closeSearch=document.querySelector('[data-search-close]');
  if(overlay&&openSearch){
    const input=overlay.querySelector('input');
    const searchable=[
      ['How to use ChatGPT: a beginner’s first guide',root+'guides/start-with-chatgpt.html','Start here · ChatGPT'],
      ['How to use Claude: a beginner’s first guide',root+'guides/start-with-claude.html','Start here · Claude'],
      ['Start using Claude or ChatGPT',root+'guides/start-here.html','Beginner guides'],
      ['Latest Claude and ChatGPT releases, benchmarks, and tests',root+'ai-updates/index.html','Latest releases'],
      ['AI agents: what happens when AI can take action?',root+'insights/ai-agents-explained.html','AI · Explainer'],
      ['The race to build better AI chips, explained',root+'insights/ai-chips-explained.html','Tech · Explainer'],
      ['Choosing an AI assistant: what should you compare?',root+'insights/choosing-ai-assistant.html','Tools · Guide'],
      ['A simple digital privacy checkup',root+'insights/privacy-checkup.html','Digital life · Guide'],
      ['What makes an app feel genuinely helpful?',root+'insights/helpful-apps.html','Apps · Explainer'],
      ['Why technology companies build ecosystems',root+'insights/tech-ecosystems.html','Companies · Explainer'],
      ['Find a tool that fits your life',root+'tools/index.html','Tools & products'],
      ['Practical guides for everyday technology',root+'guides/index.html','Guides'],
      ['Interactive Workflow Lab',root+'workflows/index.html','Practice'],
      ['Lead research to relevant outreach',root+'workflows/lead-research-loop.html','Workflow'],
      ['Local lead research brief builder',root+'tools/lead-research-brief.html','Prospect research · Local tool'],
      ['Turn AI releases into team learning',root+'workflows/release-to-learning.html','Workflow'],
      ['Connect engagement to acquisition cost',root+'workflows/engagement-to-cac.html','Workflow']
    ];
    const results=document.createElement('div');results.className='search-results';input.after(results);
    function showResults(){const q=input.value.trim().toLowerCase();results.innerHTML=q?searchable.filter(x=>x[0].toLowerCase().includes(q)||x[2].toLowerCase().includes(q)).map(x=>`<a class="search-result" href="${x[1]}"><small>${x[2]}</small><strong>${x[0]}</strong><span>↗</span></a>`).join(''):'<p class="note">Search beginner guides, releases, and practical explainers.</p>';if(q&&!results.children.length)results.innerHTML='<p class="note">No matching story yet. Try “Claude”, “ChatGPT”, or a task like “research”.</p>'}
    openSearch.addEventListener('click',()=>{overlay.classList.add('open');showResults();setTimeout(()=>input.focus(),30);track('site_search_open')});
    input.addEventListener('input',showResults);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){const first=results.querySelector('a');if(first)location.href=first.href}});
    closeSearch?.addEventListener('click',()=>overlay.classList.remove('open'));
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open')});
  }
  track('page_view',{page_path:location.pathname,page_title:document.title});
  document.querySelectorAll('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());
  const consent=document.querySelector('.cookie');
  try{if(consent&&!localStorage.getItem(consentKey))consent.classList.add('show')}catch{}
  document.querySelectorAll('[data-consent]').forEach(b=>b.addEventListener('click',()=>{try{localStorage.setItem(consentKey,b.dataset.consent)}catch{}consent?.classList.remove('show');if(b.dataset.consent==='analytics')track('analytics_consent',{consent:true})}));
  let engaged=false, scrolled=false;
  setTimeout(()=>{if(!engaged){engaged=true;track('engaged_30_seconds',{page_path:location.pathname})}},30000);
  window.addEventListener('scroll',()=>{if(scrolled)return;const max=document.documentElement.scrollHeight-window.innerHeight;if(max>0&&window.scrollY/max>=.5){scrolled=true;track('engaged_50_percent_scroll',{page_path:location.pathname})}},{passive:true});
  document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';if(a.hasAttribute('data-newsletter-subscribe'))track('newsletter_subscribe_click',{link_url:href});else if(/services|contact/.test(href))track('service_interest_click',{link_url:href,link_text:a.textContent.trim().slice(0,80)});else if(/newsletter/.test(href)||a.closest('.newsletter'))track('newsletter_interest_click',{link_url:href});});
  const form=document.querySelector('[data-demo-form]');
  if(form)form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;
    const values=new FormData(form);
    const subject='LeadGenLab enquiry: '+(values.get('type')||'Project enquiry');
    const body=[
      'Hello Het,','','Name: '+(values.get('name')||''),
      'Email: '+(values.get('email')||''),
      'Enquiry type: '+(values.get('type')||''),
      'Timing: '+(values.get('timeline')||''),
      '', 'A little about the goal:', (values.get('message')||'(No additional detail provided.)')
    ].join('\n');
    const status=form.querySelector('[data-form-status]');
    const mailto='mailto:het.soni@soniconsultancyservices.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    if(status)status.textContent='Your email app should open with a draft. Nothing is sent until you choose Send.';
    const note=form.querySelector('.form-note');
    if(note)note.textContent='This opens an email draft to Het. Nothing is sent or stored by this site; review the draft and press Send in your email app when you are ready.';
    window.location.href=mailto;
    track('project_enquiry_draft_prepared');
  });
  if(form){
    const note=form.querySelector('.form-note'),submit=form.querySelector('[type="submit"]'),status=form.querySelector('[data-form-status]');
    if(note)note.textContent='This opens an email draft addressed to Het. Nothing is sent until you review the message and press Send in your email app.';
    if(submit)submit.textContent='Prepare email draft';
    if(status){
      const copyButton=document.createElement('button');
      copyButton.type='button';copyButton.className='brief-reset contact-copy';copyButton.textContent='Copy details instead';
      submit?.parentElement.insertBefore(copyButton,status);
      copyButton.addEventListener('click',async()=>{
        const data=new FormData(form);
        const text=[
          'To: het.soni@soniconsultancyservices.com',
          'Subject: LeadGenLab enquiry: '+(data.get('type')||'Project enquiry'),
          '',
          'Name: '+(data.get('name')||''),
          'Email: '+(data.get('email')||''),
          'Enquiry type: '+(data.get('type')||''),
          'Timing: '+(data.get('timeline')||''),
          '',
          'A little about the goal:',
          (data.get('message')||'(No additional detail provided.)')
        ].join('\n');
        try{await navigator.clipboard.writeText(text);status.textContent='Enquiry details copied. Paste them into an email to Het; nothing has been sent.'}
        catch{status.textContent='Clipboard is unavailable. Use the direct email link to write Het.'}
      });
    }
  }
  const filters=document.querySelectorAll('[data-filter]'),items=document.querySelectorAll('[data-category]');filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const chosen=btn.dataset.filter;items.forEach(i=>i.classList.toggle('hidden',chosen!=='all'&&i.dataset.category!==chosen));track('content_filter_used',{filter:chosen})}));
  const search=document.querySelector('[data-card-search]');if(search)search.addEventListener('input',()=>{const q=search.value.toLowerCase();items.forEach(i=>i.classList.toggle('hidden',!i.textContent.toLowerCase().includes(q)))});
  const progress=document.querySelector('.progress'),article=document.querySelector('.prose');if(progress&&article)window.addEventListener('scroll',()=>{const d=article.scrollHeight-window.innerHeight;progress.style.width=(d>0?Math.min(100,Math.max(0,(window.scrollY-article.offsetTop)/d*100)):0)+'%'},{passive:true});
  document.querySelectorAll('[data-reaction]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-reaction]').forEach(b=>b.disabled=true);const out=document.querySelector('[data-reaction-status]');if(out)out.textContent='Thanks—your feedback helps us make future explainers clearer.';track('article_feedback',{response:btn.textContent.trim()})}));
  const finder=document.querySelector('[data-tool-finder]');if(finder)finder.addEventListener('submit',e=>{e.preventDefault();const need=finder.querySelector('[name=need]').value,result=document.querySelector('[data-finder-result]');const copy={writing:'Start with a general-purpose AI assistant. Compare how well it follows instructions, cites sources, handles your files, and protects your data.',research:'Look for a research assistant that links claims to sources and lets you inspect citations. Verify important claims against original sources.',creative:'Try a tool designed for your format—image, audio, or video—and compare usage rights, editing controls, and export quality.',organizing:'Consider an assistant that works inside the calendar, notes, or task app you already use. Check integrations and data controls before connecting accounts.'};result.innerHTML='<strong>Your starting point</strong><br>'+copy[need]+'<br><span class="note">This is a general starting point, not a paid endorsement. We’ll publish comparisons as the directory grows.</span>';result.classList.add('show');track('tool_finder_completed',{need})});
  const estimator=document.querySelector('[data-estimator]');if(estimator)estimator.addEventListener('submit',e=>{e.preventDefault();const type=estimator.querySelector('[name=scope]').value,level=estimator.querySelector('[name=complexity]').value;const tips={lean:'A focused first version can center on one core task. Validate that workflow, then add capabilities from what users actually need.',standard:'Map the main user roles and integrations, then choose the smallest release that proves the core value.',advanced:'Split the idea into phases. Start with product discovery and technical risk review before committing to a full build.'};const result=document.querySelector('[data-estimate-result]');result.innerHTML='<strong>A useful next step for your '+type+'</strong><br>'+tips[level]+'<br><a class="text-link" href="'+root+'contact/index.html">Discuss your idea with Soni Consultancy Services ↗</a><br><span class="note">Planning guidance only—not a price quote.</span>';result.classList.add('show');estimator.querySelector('[name=scope-summary]').value=type+' / '+level;track('project_planner_completed',{scope:type,complexity:level})});
  document.querySelectorAll('[data-copy-link]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);b.textContent='Copied';track('article_link_copied')}catch{b.textContent='Copy unavailable'}}));
  const learningPaths={
    general:{label:'GENERAL READER',example:'Choose one update you have seen recently.',simple:'Start with the latest update at the top of this page. Open its source and mark one detail you want to understand.',tasks:[['Notice','What changed?','Read the plain-English summary. Find the exact feature, model, or access change.'],['Relate','Why could it matter?','Connect the update to a question, task, or decision in your own life.'],['Try','One safe task','Try one low-risk example. Do not share private details you would not want stored.'],['Reflect','What did you learn?','Check the result against a trusted source. Decide whether to use it again.']],technical:'Start at the latest entry. Separate a capability announcement from an availability change, then inspect the source and limits.'},
    sales:{label:'SALES / BUSINESS DEVELOPMENT',example:'Use AI to prepare a relevant first touch.',simple:'Pick one public company update. Ask AI for a short account-relevant angle, then verify every fact before sending anything.',tasks:[['Spot','Find the signal','Choose a buyer, account, or industry signal from a cited source.'],['Shape','Draft a relevant angle','Ask for a concise opener tied to the prospect’s stated priorities.'],['Verify','Check every claim','Confirm names, facts, permissions, and personalization before sending.'],['Learn','Measure response','Track reply quality and meetings, not just message volume.']],technical:'Prototype a sourced account-research and drafting workflow. Gate outbound actions on human review and log source quality, edit rate, reply rate, and meeting conversion.'},
    marketing:{label:'MARKETING / GROWTH',example:'Turn one release into a small audience test.',simple:'Choose one new feature your audience may care about. Make two clear explainers and see which one helps readers take the next step.',tasks:[['Audience','Name the reader','Choose one segment and one real question they are trying to answer.'],['Explain','Make two clear angles','Create a beginner version and a practical use-case version.'],['Review','Protect trust','Check claims, source links, brand voice, privacy, and accessibility.'],['Measure','Learn from behavior','Compare useful engagement such as saves, completions, and qualified enquiries.']],technical:'Build a small content experiment with defined segments, attribution, holdout or baseline, accessible variants, and consent-aware analytics. Optimize qualified outcomes, not vanity clicks.'},
    founder:{label:'FOUNDER / BUSINESS OWNER',example:'Find a repeatable task before buying another tool.',simple:'Start with one task that regularly takes your team too long. See whether the AI update helps, then compare the time and quality.',tasks:[['Choose','Find repeated work','Name one time-consuming workflow and how often it happens.'],['Test','Keep the pilot small','Use sample or low-risk data and set a clear success measure.'],['Check','Include the real costs','Count review time, errors, subscription, and data risk as well as speed.'],['Decide','Scale only what works','Keep the change, refine it, or stop. Tell the team what you learned.']],technical:'Frame a narrow pilot with baseline throughput, human review effort, failure thresholds, data classification, model and API costs, and a rollback path.'},
    developer:{label:'DEVELOPER / IT',example:'Turn the release note into a reproducible evaluation.',simple:'Try the feature with a small example, then check whether it gives a result you can trust and repeat.',tasks:[['Inspect','Read the primary source','Check model/API availability, version notes, input limits, and known constraints.'],['Prototype','Build one narrow flow','Use test data, scoped credentials, and an observable baseline.'],['Evaluate','Compare the trade-offs','Measure task success, latency, cost, robustness, and human corrections.'],['Ship','Deploy with safeguards','Add monitoring, human escalation, rate controls, and a rollback option.']],technical:'Pin model/version, normalize prompts and fixtures, run representative evaluations, inspect tool permissions, and report quality, latency, cost, and regression deltas before rollout.'},
    operations:{label:'OPERATIONS / CUSTOMER SUPPORT',example:'Reduce one handoff while keeping a human check.',simple:'Look for one repeated question or handoff. Let AI prepare a draft, then have a person check it before it reaches a customer.',tasks:[['Map','Find the friction','Draw the current steps and note where delays, rework, or repeated questions occur.'],['Assist','Try a low-risk draft','Let AI summarize or prepare a response while a person still approves it.'],['Protect','Check access and errors','Use only approved information. Record mistakes and escalation needs.'],['Improve','Keep the process clear','Document the new steps and review whether time or resolution quality changed.']],technical:'Map system boundaries and role access; introduce draft-only automation first, confidence thresholds, exception queues, traceable sources, and service-level/error monitoring.'},
    educator:{label:'EDUCATOR / TRAINER',example:'Turn a feature into a short, checkable lesson.',simple:'Ask for a simple demonstration, then compare it with a trusted source and explain the idea in your own words.',tasks:[['Frame','Set a learning goal','Decide what learners should understand or be able to do.'],['Demonstrate','Show one example','Use a relevant prompt or visual and make the AI’s role clear.'],['Verify','Check accuracy and access','Review facts, bias, age suitability, accessibility, and privacy.'],['Reflect','Ask learners to teach back','Invite learners to explain what worked and where human judgment mattered.']],technical:'Design an outcome-aligned lesson with reproducible prompts, source checks, accessible visuals, privacy boundaries, and an assessment that distinguishes recall from understanding.'},
    student:{label:'STUDENT / CAREER STARTER',example:'Use AI to learn a concept, not skip the learning.',simple:'Ask AI to explain a topic, try a practice question, then check your answer using your course notes or another trusted source.',tasks:[['Ask','Name what is unclear','Turn one confusing idea into a specific question.'],['Practice','Try it yourself','Ask for a hint or a worked example, then solve a similar question on your own.'],['Check','Compare sources','Review the answer against course materials and note anything uncertain.'],['Explain','Teach it back','Summarize the idea without the tool. Keep track of what you still need to learn.']],technical:'Use the assistant for scaffolding and practice generation; independently solve a parallel task, verify citations, and disclose AI use where your course requires it.'}
  };
  document.querySelectorAll('[data-role-lab]').forEach(lab=>{
    const select=lab.querySelector('[data-role-select]'),steps=[...lab.querySelectorAll('.role-step')],detail=lab.querySelector('[data-step-detail]'),example=lab.querySelector('[data-role-example]'),depthButtons=[...lab.querySelectorAll('[data-depth]')];
    let role='general',depth='simple',active=0;
    try{role=localStorage.getItem('lgl-role')||'general'}catch{}
    if(!learningPaths[role])role='general';
    select.value=role;
    function render(){const path=learningPaths[role];example.querySelector('small').textContent='PERSONALISED FOR '+path.label;example.querySelector('strong').textContent=path.example;example.querySelector('p').textContent=depth==='simple'?path.simple:path.technical;steps.forEach((button,index)=>{const task=path.tasks[index];button.querySelector('[data-step-title]').textContent=task[0];button.querySelector('[data-step-label]').textContent=task[1];button.classList.toggle('active',index===active);button.setAttribute('aria-pressed',index===active)});detail.textContent=depth==='simple'?path.tasks[active][2]:path.tasks[active][2]+' '+path.technical;lab.querySelector('[data-map-label]').textContent='YOUR '+path.label+' LEARNING ROUTE';track('learning_path_viewed',{role,depth,step:active})}
    select.addEventListener('change',()=>{role=select.value;active=0;try{localStorage.setItem('lgl-role',role)}catch{}render();document.dispatchEvent(new CustomEvent('leadgenlab:rolechange',{detail:{role}}))});
    depthButtons.forEach(button=>button.addEventListener('click',()=>{depth=button.dataset.depth;depthButtons.forEach(b=>{const activeButton=b===button;b.classList.toggle('active',activeButton);b.setAttribute('aria-pressed',activeButton)});render()}));
    steps.forEach((button,index)=>button.addEventListener('click',()=>{active=index;render()}));
    render();
  });

  const flowSteps={lead:[['Signal','Start with a public, sourced update'],['Fit','Connect it to the account’s stated priorities'],['Draft','Prepare a concise, specific opener'],['Review','Check facts, relevance, and permission']],release:[['Source','Read the official release'],['Explain','Translate the change'],['Try','Use a safe sample task'],['Decide','Keep, retest, or skip']],growth:[['Baseline','Map the current journey'],['Listen','Find the point of friction'],['Test','Change one step'],['Learn','Compare qualified outcomes']],support:[['Request','Understand the incoming need'],['Context','Use only approved information'],['Draft','Prepare a suggested response'],['Human check','Review before sending or changing data']],compare:[['Same task','Use identical input and instructions'],['Baseline','Record the existing result'],['Variant','Run the comparison fairly'],['Decide','Quality, time, privacy, cost']]};
  const roleLabels={sales:'Sales / business development',marketing:'Marketing / growth',founder:'Founder / business owner',developer:'Developer / IT',operations:'Operations / support',educator:'Educator / trainer',student:'Student / career starter',general:'General reader'};
  document.querySelectorAll('[data-workflow-demo]').forEach(demo=>{
    const form=demo.querySelector('[data-workflow-form]');if(!form)return;
    const selector=form.querySelector('[name="role"]'),task=form.querySelector('[name="task"]'),button=form.querySelector('[data-run-workflow]'),output=demo.querySelector('[data-workflow-output]'),items=[...demo.querySelectorAll('[data-stage]')];
    try{const saved=localStorage.getItem('lgl-role');if(saved&&roleLabels[saved])selector.value=saved}catch{}
    const updateStages=()=>{const data=flowSteps[demo.dataset.workflowKind]||flowSteps.release;items.forEach((item,i)=>{if(data[i]){item.querySelector('strong').textContent=data[i][0];item.querySelector('small').textContent=data[i][1]}})};updateStages();
    form.addEventListener('submit',e=>{e.preventDefault();if(!task.value.trim())return;const value=task.value.trim(),role=selector.value;button.disabled=true;items.forEach(x=>x.classList.remove('is-active','is-done'));output.textContent='Starting the local walkthrough…';const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let step=0;function advance(){if(step>0)items[step-1]?.classList.replace('is-active','is-done');if(step<items.length){items[step].classList.add('is-active');output.textContent='Step '+(step+1)+' of '+items.length+': '+items[step].querySelector('strong').textContent+'. '+items[step].querySelector('small').textContent;step++;setTimeout(advance,reduced?0:620)}else{button.disabled=false;button.innerHTML='Run it again <span class="arrow">↗</span>';output.textContent='Practice result for '+roleLabels[role]+': “'+value+'” has passed through the example workflow. Before using it, check the source, sensitive data, and human approval point. This is a learning simulation—no AI service was called and nothing was sent.';track('workflow_simulation_completed',{kind:demo.dataset.workflowKind,role})}}advance();track('workflow_simulation_started',{kind:demo.dataset.workflowKind,role})});
  });
  document.addEventListener('leadgenlab:rolechange',e=>{const role=e.detail&&e.detail.role;if(!roleLabels[role])return;try{localStorage.setItem('lgl-role',role)}catch{}document.querySelectorAll('[data-global-role],[data-role-select],[data-workflow-demo] [name="role"]').forEach(select=>{if([...select.options].some(o=>o.value===role)&&select.value!==role){select.value=role;if(select.matches('[data-role-select]'))select.dispatchEvent(new Event('change'))}})});
  document.querySelectorAll('[data-workflow-demo] [name="role"]').forEach(select=>select.addEventListener('change',()=>document.dispatchEvent(new CustomEvent('leadgenlab:rolechange',{detail:{role:select.value}}))));
  document.querySelectorAll('[data-global-role]').forEach(select=>{try{const v=localStorage.getItem('lgl-role');if(v&&[...select.options].some(o=>o.value===v))select.value=v}catch{}select.addEventListener('change',()=>{try{localStorage.setItem('lgl-role',select.value)}catch{}document.querySelectorAll('[data-workflow-demo] [name="role"]').forEach(x=>x.value=select.value);document.dispatchEvent(new CustomEvent('leadgenlab:rolechange',{detail:{role:select.value}}))})});
  document.querySelectorAll('[data-flow-preset]').forEach(btn=>btn.addEventListener('click',()=>{const demo=document.querySelector('.workflow-demo');if(!demo)return;const config={lead:['lead','Lead research → relevant outreach','A company announces a new product line'],release:['release','AI release → shared understanding','A new model launches with a coding feature'],growth:['growth','Engagement → a better conversion path','Readers open a guide but do not try the example'],support:['support','Support request → reviewed response','A customer asks how to change an account setting'],compare:['compare','Same task → fair model comparison','Summarize a public report in 5 bullet points']};const kind=btn.dataset.flowPreset,c=config[kind];if(!c)return;document.querySelectorAll('[data-flow-preset]').forEach(b=>b.classList.toggle('active',b===btn));demo.dataset.workflowKind=kind;demo.querySelector('[data-workflow-form] [name="task"]').value=c[2];demo.querySelector('[data-workflow-output]').textContent='Ready when you are. This walkthrough is a local learning simulation; no information is sent to an AI service.';demo.querySelector('[data-run-workflow]').disabled=false;demo.querySelector('[data-run-workflow]').innerHTML='Run the example <span class="arrow">↗</span>';demo.querySelectorAll('[data-stage]').forEach(x=>x.classList.remove('is-active','is-done'));const t=document.querySelector('[data-flow-title]'),d=document.querySelector('[data-flow-description]');if(t)t.textContent=c[1];if(d)d.textContent=({lead:'Take one public company signal, check whether it matters to the account, prepare a useful first touch, then verify it before anything is sent.',release:'Start with the official note, explain it in plain language, connect it to a role, then try a safe task.',growth:'Map the current path, find a point of friction, change one step, and compare meaningful outcomes.',support:'Understand the request, use approved context, prepare a draft, and leave the consequential action to a person.',compare:'Use one prompt and input, record the baseline, compare a candidate, and evaluate quality, privacy, speed, and cost.'})[kind];demo.querySelectorAll('[data-stage]').forEach((x,i)=>{const st=flowSteps[kind][i];if(st){x.querySelector('strong').textContent=st[0];x.querySelector('small').textContent=st[1]}})}));
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&window.matchMedia('(pointer:fine)').matches){document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty('--tilt-x',(-y*3)+'deg');card.style.setProperty('--tilt-y',(x*4)+'deg')});card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg')})})}
})();

// Copy the non-sensitive starter prompt locally for readers to try in their own assistant.
document.querySelectorAll('[data-copy-prompt]').forEach(button=>button.addEventListener('click',async()=>{const prompt=button.parentElement.querySelector('pre').innerText;const status=button.parentElement.querySelector('small');try{await navigator.clipboard.writeText(prompt);status.textContent='Copied. Paste it into your chat when ready.'}catch{status.textContent='Select the prompt above to copy it.'}}));
