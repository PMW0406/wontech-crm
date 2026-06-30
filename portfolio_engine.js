/* WTPF — Sales Portfolio 집계 엔진
 * WTU.transformRaw 출력행(2026) → sales_portfolio blob (회계분).
 * Sales Portfolio 엑셀 로직 충실 포팅: SUMIFS(금액, 품목=AM, 분기, 국내외) / 1e6.
 * 미반영은 사이트에서 live(ilbo_pending)로 가산 — 여기선 회계분만.
 * 순수 계산(네트워크/DOM 없음). 브라우저(window.WTPF)+Node 공용.
 */
(function(root){
'use strict';

// 구분#4(제품, =WTU prodName) → 포트폴리오 품목(AM). 엑셀 범례에서 추출(2025+2026 raw).
var P4_TO_ITEM = {
  'Oligio':'Oligio','Oligio X':'Oligio X','The Oligio':'Oligio X','Oligio Kiss':'Oligio Kiss',
  'Tightan':'Tightan','Ultraskin Tightan':'Tightan','Ultraskin Tightan II':'Tightan','Ultra-Skin':'Tightan',
  'Lavieen':'Lavieen','NOUVADerm':'Lavieen',
  'Pastelle':'Pastelle','Pastelle Pro':'Pastelle',
  'V-Laser':'V-Laser','ALMA-Veil':'V-Laser',
  'Picocare Majesty':'Picocare Majesty','Majesty':'Picocare Majesty',
  'PicoCare':'Picocare 450','PicoCare 450':'Picocare 450','Picocare 450P':'Picocare 450','PicoCare 450P':'Picocare 450','Picocare':'Picocare 450',
  'Pico Andy':'Pico Andy','Pico Alex':'PicoAlex','PicoAlex':'PicoAlex',
  'SANDRO Dual':'SANDRO Dual','AVVIO':'AVVIO',
  'ASR':'Cosjet ASR','Cosjet ASR':'Cosjet ASR','Cosjet SR':'Cosjet ASR',
  'ATR':'기타 레이저','Mercury':'기타 레이저','Thy S':'기타 레이저','Thy-S':'기타 레이저',
  'HolinWON Prima':'HolinWON','HolinWON Pro':'HolinWON','HolinWON':'HolinWON',
  'Veincare':'Veincare','Beladona':'Beladona','BELADONA ll':'Beladona','Beladona II':'Beladona',
  'Oligio Tip [F-4.0]':'Oligio Tip','Oligio Tip [E-0.25]':'Oligio Tip','Oligio Tip [XF-4.0]':'Oligio Tip','Oligio Tip [XE-0.25]':'Oligio Tip',
  'Cartridge':'Cartridge'
};
// 보고서 카테고리/순서 구조 (RF/HIFU는 RF·HIFU 소계로 분리)
var STRUCT = [
  {cat:'RF/HIFU', subs:[
    {sub:'RF 소계', items:['Oligio','Oligio X','Oligio Kiss']},
    {sub:'HIFU 소계', items:['Tightan']}
  ]},
  {cat:'Laser', items:['Lavieen','Pastelle','V-Laser','Picocare Majesty','Picocare 450','Pico Andy','PicoAlex','SANDRO Dual','AVVIO','Cosjet ASR','기타 레이저']},
  {cat:'Surgical', items:['HolinWON','Veincare','Beladona']},
  {cat:'소모품', items:['Oligio Tip','Cartridge']}
];
// 품목→카테고리 (역índ)
var ITEM_CAT={};
STRUCT.forEach(function(g){
  if(g.subs) g.subs.forEach(function(s){ s.items.forEach(function(it){ ITEM_CAT[it]=g.cat; }); });
  else g.items.forEach(function(it){ ITEM_CAT[it]=g.cat; });
});
// 내부거래 제외 안 함 — 엑셀 보고표는 해외 종속법인(태국/WONTECH ASIA 등)을 포함하므로
// 'wontech' 매칭으로 빼면 태국법인 매출이 통째로 누락됨. 품목 분류(classify)로만 한정.
function num(v){ if(v==null||v==='') return 0; var n=parseFloat(v); return isNaN(n)?0:n; }
function pint(v){ if(v==null||v==='') return 0; var n=parseInt(parseFloat(v),10); return isNaN(n)?0:n; }
function classify(prod){ var p=String(prod==null?'':prod).trim(); return P4_TO_ITEM[p]||null; }

// rows26: WTU.transformRaw 출력 (각 행 {금액,국내외,'구분#2','구분#4',분기,수량,거래처명})
// 반환: {amount:{전체|국내|해외:{item:[q1..q4]}}, qty:{...}}  (백만원/대, 2026)
function aggregate(rows26){
  var A={'전체':{},'국내':{},'해외':{}}, Q={'전체':{},'국내':{},'해외':{}};
  function add(map,scope,item,qi,val){ var m=map[scope]; if(!m[item]) m[item]=[0,0,0,0]; m[item][qi]+=val; }
  rows26.forEach(function(r){
    var item=classify(r['구분#4']); if(!item) return;           // 기타/써지컬/의료기기 제외
    var q=pint(r['분기']); if(q<1||q>4) return; var qi=q-1;
    var dom=(r['국내외']==='해외')?'해외':'국내';
    var amt=num(r['금액'])/1e6;                                 // 백만원(net)
    add(A,'전체',item,qi,amt); add(A,dom,item,qi,amt);
    // 수량: 소모품 제외(보고서 수량표에 소모품 없음)
    if(ITEM_CAT[item]!=='소모품'){
      var qty=pint(r['수량']);
      add(Q,'전체',item,qi,qty); add(Q,dom,item,qi,qty);
    }
  });
  return {amount:A, qty:Q};
}

// 기존 SP에서 2025(q25,t25) 가져오기 (cat,item 매칭)
function prev25(existingSP, unit, scope, cat, item){
  try{
    var arr=existingSP[unit][scope];
    for(var i=0;i<arr.length;i++){ if(arr[i].cat===cat&&arr[i].item===item) return {q25:arr[i].q25||[0,0,0,0], t25:arr[i].t25||0}; }
  }catch(e){}
  return {q25:[0,0,0,0], t25:0};
}

// 한 (unit,scope)의 보고 행배열 생성 (총합계/소계/RF소계/HIFU소계/품목)
function buildRows(agg26, existingSP, unit, scope){
  var data26=(unit==='amount'?agg26.amount:agg26.qty)[scope]||{};
  var rows=[]; var sum4=function(a,b){ return [a[0]+b[0],a[1]+b[1],a[2]+b[2],a[3]+b[3]]; };
  var sumArr=function(a){ return a[0]+a[1]+a[2]+a[3]; };
  var grand=[0,0,0,0], g25=[0,0,0,0];
  var bodyByCat=[];
  STRUCT.forEach(function(g){
    if(unit==='qty' && g.cat==='소모품') return;               // 수량: 소모품 제외
    var catRows=[], cat26=[0,0,0,0], cat25=[0,0,0,0];
    var pushItem=function(it){
      var q26=data26[it]||[0,0,0,0];
      var pv=prev25(existingSP,unit,scope,g.cat,it);
      cat26=sum4(cat26,q26); cat25=sum4(cat25,pv.q25);
      catRows.push({cat:g.cat,item:it,q25:pv.q25,t25:pv.t25,q26:q26,t26:sumArr(q26)});
    };
    if(g.subs){
      var subBlocks=[];
      g.subs.forEach(function(s){
        var sub26=[0,0,0,0], sub25=[0,0,0,0], items=[];
        s.items.forEach(function(it){
          var q26=data26[it]||[0,0,0,0]; var pv=prev25(existingSP,unit,scope,g.cat,it);
          sub26=sum4(sub26,q26); sub25=sum4(sub25,pv.q25);
          items.push({cat:g.cat,item:it,q25:pv.q25,t25:pv.t25,q26:q26,t26:sumArr(q26)});
        });
        cat26=sum4(cat26,sub26); cat25=sum4(cat25,sub25);
        subBlocks.push({sub:{cat:g.cat,item:s.sub,q25:sub25,t25:sumArr(sub25),q26:sub26,t26:sumArr(sub26)}, items:items});
      });
      bodyByCat.push({cat:g.cat, catRow:{cat:g.cat,item:'소계',q25:cat25,t25:sumArr(cat25),q26:cat26,t26:sumArr(cat26)}, subBlocks:subBlocks});
    } else {
      g.items.forEach(pushItem);
      bodyByCat.push({cat:g.cat, catRow:{cat:g.cat,item:'소계',q25:cat25,t25:sumArr(cat25),q26:cat26,t26:sumArr(cat26)}, items:catRows});
    }
    grand=sum4(grand,cat26); g25=sum4(g25,cat25);
  });
  rows.push({cat:'총합계',item:'총합계',q25:g25,t25:sumArr(g25),q26:grand,t26:sumArr(grand)});
  bodyByCat.forEach(function(b){
    rows.push(b.catRow);
    if(b.subBlocks){ b.subBlocks.forEach(function(sb){ rows.push(sb.sub); sb.items.forEach(function(it){ rows.push(it); }); }); }
    else b.items.forEach(function(it){ rows.push(it); });
  });
  return rows;
}

function buildPortfolio(rows26, existingSP, updatedAt){
  existingSP=existingSP||{amount:{},qty:{}};
  var agg26=aggregate(rows26);
  var out={ unit:'백만원', asOf:(updatedAt||(existingSP.asOf)||''), updatedAt:(updatedAt||''),
    amount:{}, qty:{}, notes:(existingSP.notes||[]) };
  ['전체','국내','해외'].forEach(function(s){
    out.amount[s]=buildRows(agg26,existingSP,'amount',s);
    out.qty[s]=buildRows(agg26,existingSP,'qty',s);
  });
  return out;
}

var WTPF={ buildPortfolio:buildPortfolio, aggregate:aggregate, classify:classify, P4_TO_ITEM:P4_TO_ITEM, STRUCT:STRUCT };
if(typeof module!=='undefined'&&module.exports) module.exports=WTPF;
root.WTPF=WTPF;
})(typeof window!=='undefined'?window:(typeof global!=='undefined'?global:this));
