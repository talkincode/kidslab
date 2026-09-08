import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

// Ideal circuit visualization; the model remains the single source of readings.
export function createCircuitScene(host) {
  const renderer = new THREE.WebGLRenderer({ canvas: host.tagName === 'CANVAS' ? host : undefined, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x112f39, 1);
  if (host.tagName !== 'CANVAS') host.prepend(renderer.domElement);
  renderer.domElement.setAttribute('aria-label', '3D circuit');
  renderer.domElement.setAttribute('role', 'img');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const target = new THREE.Vector3(0, 0, 0);
  let yaw = .15, elevation = .95, radius = 12, current = 0, running = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  scene.add(new THREE.HemisphereLight(0xe5faff, 0x344342, 1.2));
  const light = new THREE.DirectionalLight(0xffffff, 2.8);
  light.position.set(-3, 8, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  scene.add(light);
  const material = (color) => new THREE.MeshStandardMaterial({ color, roughness: .38, metalness: .28, envMapIntensity: 1.15 });
  function box(x,y,z,w,h,d,color) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material(color));
    mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; scene.add(mesh); return mesh;
  }
  box(0,-.3,0,10,.35,6.7,0x244750);
  const grid = new THREE.GridHelper(10, 20, 0x42656a, 0x35565e);
  grid.position.y = -.11; grid.scale.z = .65; scene.add(grid);
  const labels = [];
  let lastSprite;
  function label(text, x,z,background='#f4c65d',color='#291e08') {
    const canvas = document.createElement('canvas'); canvas.width=512; canvas.height=128;
    const ctx=canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map:texture, depthTest:false, toneMapped:false}));
    sprite.position.set(x,1.25,z); sprite.scale.set(2.1,.525,1); scene.add(sprite);
    const set=(value,fault=false)=>{ctx.clearRect(0,0,512,128);ctx.fillStyle=fault?'#b92e3e':background;ctx.fillRect(0,0,512,128);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.strokeRect(3,3,506,122);ctx.fillStyle=color;ctx.font='bold 52px sans-serif';ctx.textAlign='center';ctx.fillText(value,256,83);texture.needsUpdate=true;};
    set(text); labels.push(texture); lastSprite=sprite; return set;
  }
  const supply=box(-3.5,.35,0,1.4,.8,1.7,0xe6ab43);
  // Instrument details are attached to their body so rewiring moves the whole device.
  function part(parent, geometry, color, x,y,z) {
    const mesh=new THREE.Mesh(geometry,material(color));mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  function block(parent,x,y,z,w,h,d,color){return part(parent,new THREE.BoxGeometry(w,h,d),color,x,y,z);}
  function cylinder(parent,x,y,z,r,h,color){return part(parent,new THREE.CylinderGeometry(r,r,h,32),color,x,y,z);}
  function screws(parent,w,d,y){for(const x of [-w,w])for(const z of [-d,d]){
    cylinder(parent,x,y,z,.034,.018,0xbec9d0);
    block(parent,x,y+.012,z,.04,.009,.008,0x26333d);
  }}
  block(supply,0,.411,0,1.23,.045,1.51,0x303e49);
  block(supply,0,.445,-.28,.92,.03,.45,0x0a211d);
  for(let i=0;i<5;i++)block(supply,-.45+i*.21,.447,.12,.12,.025,.035,0x111a23);
  cylinder(supply,-.36,.5,.43,.13,.12,0x161e29);
  block(supply,-.36,.565,.4,.025,.015,.1,0xf4e9cb);
  const fuseBase=block(supply,.31,.47,.42,.34,.06,.37,0x151f28);
  const fuseLever=block(fuseBase,0,.07,0,.12,.11,.24,0x5dce89);
  screws(supply,.53,.63,.45);
  for(const [z,color] of [[-.85,0xc72f40],[.85,0x111821]]){
    cylinder(supply,0,-.14,z,.105,.13,color);
    cylinder(supply,0,-.06,z,.055,.04,0xc3cbd0);
  }
  label('DC',-3.5,0);
  label('+',-3.5,-1.1,'#b92e3e','#ffffff');
  label('−',-3.5,1.1,'#263b56','#ffffff');
  const ammeter = box(0,.23,-2,1.65,.5,1.05,0x5ca7ba);
  const setA=label('A',0,-2,'#1460ad','#ffffff');
  const ammeterLabel=lastSprite;
  const resistor=part(scene,new THREE.CylinderGeometry(.23,.23,1.15,40),0xd7bb82,2.7,.25,0);
  resistor.rotation.x=Math.PI/2;
  for(const z of [-.6375,.6375]){
    const lead=part(scene,new THREE.CylinderGeometry(.035,.035,.125,16),0xc3cbd0,2.7,.16,z);
    lead.rotation.x=Math.PI/2;
  }
  box(2.7,-.015,0,.7,.16,1.7,0x24323d);
  const bands=[];
  for(let i=0;i<4;i++) bands.push(cylinder(resistor,0,-.4+i*.25,0,.235,.09,[0x713d22,0x171e26,0x171e26,0xcb9340][i]));
  const setR=label('10 Ω',2.7,0,'#f5c06d','#382005');
  lastSprite.scale.set(1.1,.3,1);
  const voltmeter = box(4,.23,0,1.05,.5,1.1,0x72b497);
  const setV=label('V',4,0,'#08764e','#ffffff');
  const voltmeterLabel=lastSprite;
  voltmeterLabel.scale.set(1.4,.35,1);
  function makeMeter(body,axis,unit) {
    const isA=axis==='x',w=isA?1.65:1.05,d=isA?1.05:1.1;
    block(body,0,-.25,0,w+.07,.1,d+.07,0x101b25);
    block(body,0,.26,0,w-.1,.045,d-.1,0x22333f);
    screws(body,w/2-.12,d/2-.12,.3);
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=384;
    const ctx=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;labels.push(texture);
    const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.3,d-.25),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));
    face.rotation.x=-Math.PI/2;face.position.y=.29;body.add(face);
    for(const sign of [-1,1]){
      const x=isA?sign*.825:0,z=isA?0:sign*.55;
      cylinder(body,x,-.07,z,.085,.13,sign<0?0xcd3442:0x121b23);
      cylinder(body,x,.01,z,.04,.035,0xc3cbd0);
    }
    return (value,range,fault)=>{
      ctx.fillStyle=fault?'#ffdcda':'#f3efdc';ctx.fillRect(0,0,512,384);
      ctx.strokeStyle='#24333f';ctx.lineWidth=4;
      for(let n=0;n<=10;n++){
        const angle=Math.PI+(n/10)*Math.PI;
        ctx.beginPath();ctx.moveTo(256+Math.cos(angle)*185,246+Math.sin(angle)*185);
        ctx.lineTo(256+Math.cos(angle)*(n%5===0?156:169),246+Math.sin(angle)*(n%5===0?156:169));ctx.stroke();
      }
      ctx.textAlign='center';ctx.fillStyle='#182b36';ctx.font='bold 52px sans-serif';ctx.fillText(unit,256,170);
      ctx.font='24px sans-serif';ctx.fillText('0',72,280);ctx.fillText(String(range),436,280);
      const angle=Math.PI+THREE.MathUtils.clamp(value/range,0,1)*Math.PI;
      ctx.strokeStyle=fault?'#c52b3c':'#d34b25';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(256,246);ctx.lineTo(256+Math.cos(angle)*157,246+Math.sin(angle)*157);ctx.stroke();
      ctx.fillStyle='#23323d';ctx.beginPath();ctx.arc(256,246,13,0,Math.PI*2);ctx.fill();
      ctx.font='bold 32px monospace';ctx.fillStyle=fault?'#b32334':'#182b36';ctx.fillText(fault?'PROTECTED':Number(value.toFixed(3))+' '+unit,256,342);texture.needsUpdate=true;
    };
  }
  const drawA=makeMeter(ammeter,'x','A'),drawV=makeMeter(voltmeter,'z','V');
  let wires = new THREE.Group(); scene.add(wires);
  let path;
  const particles = Array.from({length:18},()=>{
    const p=new THREE.Mesh(new THREE.SphereGeometry(.065,8,8),new THREE.MeshBasicMaterial({color:0xffd46b}));scene.add(p);return p;
  });
  function rebuild(wiring) {
    wires.traverse(o=>{o.geometry?.dispose();o.material?.dispose();}); scene.remove(wires); wires=new THREE.Group();scene.add(wires);
    const wire=(points,color)=>{
      const curve=new THREE.CurvePath();
      for(let i=1;i<points.length;i++)curve.add(new THREE.LineCurve3(new THREE.Vector3(...points[i-1]),new THREE.Vector3(...points[i])));
      const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,80,.045,8,false),material(color));wires.add(mesh);return curve;
    };
    const y=.16;
    const parallel = wiring === 'ammeter-parallel';
    const seriesV = wiring === 'voltmeter-series';
    ammeter.position.set(0,.23,parallel?0:-2);
    ammeter.rotation.y=parallel?Math.PI/2:0;
    ammeterLabel.position.z=parallel?0:-2;
    voltmeter.position.set(seriesV?0:4,.23,seriesV?1.9:0);
    voltmeter.rotation.y=seriesV?Math.PI/2:0;
    voltmeterLabel.position.x=voltmeter.position.x;
    voltmeterLabel.position.z=voltmeter.position.z;
    // Conductors stop at component terminals: no wire bypasses a meter or R.
    const red=0xee9668, green=0x78c8ba;
    if(parallel) wire([[-3.5,y,-.85],[-3.5,y,-2],[2.7,y,-2],[2.7,y,-.7]],red);
    else {
      wire([[-3.5,y,-.85],[-3.5,y,-2],[-.825,y,-2]],red);
      wire([[.825,y,-2],[2.7,y,-2],[2.7,y,-.7]],red);
    }
    if(seriesV){
      wire([[2.7,y,.7],[2.7,y,1.9],[.55,y,1.9]],red);
      wire([[-.55,y,1.9],[-3.5,y,1.9],[-3.5,y,.85]],red);
    } else {
      wire([[2.7,y,.7],[2.7,y,2.8],[-3.5,y,2.8],[-3.5,y,.85]],red);
      wire([[2.7,y,-.7],[2.7,y,-1],[4,y,-1],[4,y,-.55]],green);
      wire([[4,y,.55],[4,y,1],[2.7,y,1],[2.7,y,.7]],green);
    }
    if(parallel){
      wire([[2.7,y,-.7],[2.7,y,-1],[0,y,-1],[0,y,-.825]],0xff5353);
      wire([[0,y,.825],[0,y,1],[2.7,y,1],[2.7,y,.7]],0xff5353);
    }
    // Conventional current goes from + through A and R to −, outside the supply.
    path=new THREE.CurvePath();
    const flow=[[-3.5,y,-.85],[-3.5,y,-2],[2.7,y,-2],[2.7,y,2.8],[-3.5,y,2.8],[-3.5,y,.85]];
    for(let i=1;i<flow.length;i++)path.add(new THREE.LineCurve3(new THREE.Vector3(...flow[i-1]),new THREE.Vector3(...flow[i])));

  }
  let lastWiring;
  function update({setup,measurement:reading,status}) {
    if(lastWiring!==setup.wiring){rebuild(setup.wiring);lastWiring=setup.wiring;}
    current=reading.ok?reading.currentA:0;
    drawA(reading.ok?reading.currentA:0,setup.ammeterRangeA,!reading.ok);
    drawV(reading.ok?reading.voltageV:0,setup.voltmeterRangeV,!reading.ok);
    fuseLever.rotation.x=reading.ok?0:-.85;
    fuseLever.material.color.setHex(reading.ok?0x5dce89:0xe33142);
    host.dataset.protection=reading.ok?'closed':'open';
    host.dataset.circuitState=reading.ok?'live':'protected';
    host.dataset.fault=status;
    const aFault=['short-circuit','ammeter-overload'].includes(status);
    const vFault=['open-circuit','voltmeter-overload'].includes(status);
    ammeter.material.color.setHex(aFault?0xe33142:0x5ca7ba);
    voltmeter.material.color.setHex(status==='open-circuit'?0xd7a43b:vFault?0xe33142:0x72b497);
    wires.traverse(o=>{if(o.material){o.material.emissive.setHex(reading.ok?0x000000:status==='open-circuit'?0x302610:0x8c1322);o.material.emissiveIntensity=reading.ok?0:.65;}});
    setA(reading.ok?`A  ${Number(reading.currentA.toFixed(3))}`:aFault?'A  OL':'A —',aFault);
    setV(reading.ok?`V  ${reading.voltageV.toFixed(1)}`:vFault?'V  OPEN':'V —',vFault && status!=='open-circuit');
    setR(`${setup.resistanceOhm} Ω`);
    const digitColors=[0x171e26,0x713d22,0xc7352c,0xe78225,0xe6c82d,0x298b43,0x2462bd,0x754498,0x888888,0xeeeeee];
    bands[0].material.color.setHex(digitColors[setup.resistanceOhm<10?setup.resistanceOhm:Math.floor(setup.resistanceOhm/10)]);
    bands[1].material.color.setHex(digitColors[setup.resistanceOhm<10?0:setup.resistanceOhm%10]);
    bands[2].material.color.setHex(setup.resistanceOhm<10?0xcb9340:0x171e26);
  }
  let viewW=0,viewH=0;
  function resize(){
    const width=Math.max(1,innerWidth),height=Math.max(1,innerHeight);
    if(width===viewW&&height===viewH)return;
    viewW=width;viewH=height;
    renderer.setSize(width,height,false);
    renderer.domElement.style.width='100%';
    renderer.domElement.style.height='100%';
    camera.aspect=width/height;camera.updateProjectionMatrix();
  }
  const observer=new ResizeObserver(resize);observer.observe(host);addEventListener('resize',resize);
  const pointers=new Map();
  const clampRadius=value=>THREE.MathUtils.clamp(value,7,22);
  function zoom(factor){radius=clampRadius(radius*factor);host.dataset.zoom=(12/radius).toFixed(2);}
  zoom(1);
  const distance=()=>{const [a,b]=[...pointers.values()];return Math.hypot(a.x-b.x,a.y-b.y);};
  renderer.domElement.addEventListener('pointerdown',e=>{pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});renderer.domElement.setPointerCapture(e.pointerId);});
  renderer.domElement.addEventListener('pointermove',e=>{
    const old=pointers.get(e.pointerId);if(!old)return;
    const before=pointers.size===2?distance():0;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pointers.size===2){const after=distance();if(before>0&&after>0)zoom(before/after);}
    else if(pointers.size===1){yaw-=(e.clientX-old.x)*.008;elevation=THREE.MathUtils.clamp(elevation+(e.clientY-old.y)*.005,.4,1.56);}
  });
  for(const event of ['pointerup','pointercancel','lostpointercapture'])renderer.domElement.addEventListener(event,e=>pointers.delete(e.pointerId));
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(THREE.MathUtils.clamp(e.deltaY,-100,100)*.002));},{passive:false});
  function view(top){yaw=top?0:.15;elevation=top?1.56:.95;radius=12;zoom(1);}
  let phase=0,previous=0;
  renderer.setAnimationLoop(time=>{
    const dt=Math.min((time-previous)/1000,.05);previous=time;
    if(document.hidden||host.clientWidth===0||!running)return;
    camera.position.set(Math.sin(yaw)*Math.cos(elevation)*radius,Math.sin(elevation)*radius,Math.cos(yaw)*Math.cos(elevation)*radius);camera.lookAt(target);
    if(!reduced.matches)phase=(phase+dt*current*.18)%1;
    particles.forEach((p,i)=>{p.visible=current>0;if(path)p.position.copy(path.getPoint((phase+i/particles.length)%1));});
    renderer.render(scene,camera);
  });
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();running=false;host.dataset.failed='true';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{running=true;delete host.dataset.failed;});
  window.addEventListener('pagehide',()=>{renderer.setAnimationLoop(null);observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});labels.forEach(t=>t.dispose());renderer.dispose();},{once:true});
  resize();
  return {update,view,zoom};
}
