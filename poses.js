/* Diagramas de posición estilo maniquí (no explícitos).
   Cada figura: h = cadera [x,y], t = ángulo del torso,
   a = brazos [[brazo, antebrazo], ...], l = piernas [[muslo, pierna], ...]
   Ángulos en grados de pantalla: 0 = derecha, 90 = abajo, 180 = izquierda, -90 = arriba. */

const SCENES = {
  bed:   '<rect x="8" y="158" width="284" height="20" rx="6" fill="#3a1a24"/><rect x="8" y="158" width="284" height="5" rx="2.5" fill="#5a2a38"/>',
  edge:  '<rect x="8" y="124" width="148" height="54" rx="6" fill="#3a1a24"/><rect x="8" y="124" width="148" height="5" rx="2.5" fill="#5a2a38"/><path d="M8 178H292" stroke="#4a1c26" stroke-width="2"/>',
  floor: '<path d="M8 178H292" stroke="#4a1c26" stroke-width="2"/><ellipse cx="150" cy="176" rx="110" ry="6" fill="#3a1a24"/>',
  chair: '<path d="M8 178H292" stroke="#4a1c26" stroke-width="2"/><rect x="100" y="142" width="64" height="7" rx="3" fill="#5a2a38"/><rect x="100" y="86" width="7" height="62" rx="3" fill="#5a2a38"/><path d="M106 149V178M158 149V178" stroke="#5a2a38" stroke-width="5"/>',
  wall:  '<rect x="8" y="8" width="16" height="170" fill="#3a1a24"/><path d="M8 178H292" stroke="#4a1c26" stroke-width="2"/>',
  table: '<rect x="8" y="120" width="124" height="8" rx="3" fill="#5a2a38"/><path d="M20 128V178M122 128V178" stroke="#5a2a38" stroke-width="5"/><path d="M8 178H292" stroke="#4a1c26" stroke-width="2"/>',
  sofa:  '<rect x="18" y="128" width="104" height="26" rx="6" fill="#3a1a24"/><rect x="18" y="82" width="22" height="72" rx="8" fill="#3a1a24"/><path d="M8 178H292" stroke="#4a1c26" stroke-width="2"/><path d="M26 154V178M114 154V178" stroke="#3a1a24" stroke-width="5"/>'
};

const ELLA_COLOR = '#ff5c7a', EL_COLOR = '#f0c27b';

function pt(p, ang, len) { const r = ang * Math.PI / 180; return [p[0] + len * Math.cos(r), p[1] + len * Math.sin(r)]; }
function line(pts, w, color, op) {
  return `<polyline points="${pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
}
function figure(f, color, s) {
  const L = { t: 48 * s, ua: 25 * s, fa: 23 * s, th: 36 * s, sh: 35 * s, neck: 17 * s, r: 11 * s, tw: 17 * s, lw: 10 * s };
  const hip = f.h, sh = pt(hip, f.t, L.t), head = pt(sh, f.t + (f.n || 0), L.neck);
  const arm = a => [sh, pt(sh, a[0], L.ua), pt(pt(sh, a[0], L.ua), a[1], L.fa)];
  const leg = l => [hip, pt(hip, l[0], L.th), pt(pt(hip, l[0], L.th), l[1], L.sh)];
  return line(arm(f.a[1]), L.lw, color, .55) + line(leg(f.l[1]), L.lw * 1.15, color, .55) +
    line([hip, sh], L.tw, color, 1) +
    `<circle cx="${head[0].toFixed(1)}" cy="${head[1].toFixed(1)}" r="${L.r}" fill="${color}"/>` +
    line(leg(f.l[0]), L.lw * 1.15, color, 1) + line(arm(f.a[0]), L.lw, color, 1);
}
function poseSVG(p) {
  const order = p.front === 'el' ? [['ella', p.ella], ['el', p.el]] : [['el', p.el], ['ella', p.ella]];
  return `<svg viewBox="0 0 300 186" role="img" aria-label="Diagrama de la posición ${p.name}">` +
    (SCENES[p.scene] || '') +
    order.map(([k, f]) => figure(f, k === 'el' ? EL_COLOR : ELLA_COLOR, k === 'el' ? 1 : .9)).join('') +
    '</svg>';
}

/* nivel: 1 fácil · 2 medio · 3 atrevido */
const POSES = [
  { name: 'El Misionero', lvl: 1, scene: 'bed',
    steps: ['Ella se recuesta boca arriba con las rodillas flexionadas.', 'Él se coloca encima, de frente, apoyando su peso en los codos.', 'Ella puede rodearle la espalda con los brazos.'],
    tip: 'Una almohada bajo la cadera de ella cambia el ángulo y lo hace más intenso.',
    ella: { h: [150, 148], t: 180, a: [[-50, -10], [-40, 0]], l: [[-45, 55], [-35, 65]] },
    el:   { h: [170, 128], t: 186, a: [[95, 178], [100, 182]], l: [[20, 10], [25, 12]] } },

  { name: 'La Cucharita', lvl: 1, scene: 'bed',
    steps: ['Los dos se acuestan de lado, mirando en la misma dirección.', 'Él se acomoda detrás de ella, muy pegado.', 'Él la abraza por la cintura o el pecho.'],
    tip: 'Ideal para empezar lento: mucho contacto y poco esfuerzo.',
    ella: { h: [152, 150], t: 182, a: [[160, 175], [200, 185]], l: [[25, -5], [30, 0]] },
    el:   { h: [170, 138], t: 184, a: [[150, 188], [170, 190]], l: [[25, -5], [28, 0]] }, front: 'el' },

  { name: 'La Amazona', lvl: 1, scene: 'bed',
    steps: ['Él se recuesta boca arriba.', 'Ella se coloca de rodillas sobre él, a horcajadas, mirándolo de frente.', 'Ella marca el ritmo apoyando las manos en su pecho.'],
    tip: 'Ella tiene todo el control: velocidad, ángulo y movimiento.',
    el:   { h: [165, 150], t: 180, a: [[-140, -170], [-150, -175]], l: [[2, 0], [-3, 0]] },
    ella: { h: [168, 124], t: -102, a: [[115, 95], [108, 90]], l: [[112, 0], [108, 2]] }, front: 'ella' },

  { name: 'La Amazona Invertida', lvl: 1, scene: 'bed',
    steps: ['Él se recuesta boca arriba.', 'Ella se coloca de rodillas sobre él, a horcajadas, pero de espaldas a él.', 'Ella apoya las manos en sus muslos para moverse.'],
    tip: 'Él disfruta de la vista y puede acariciarle la espalda.',
    el:   { h: [150, 150], t: 180, a: [[-140, -170], [-150, -175]], l: [[2, 0], [-3, 0]] },
    ella: { h: [152, 124], t: -76, a: [[75, 90], [68, 85]], l: [[68, 180], [72, 178]] }, front: 'ella' },

  { name: 'El Loto', lvl: 1, scene: 'floor',
    steps: ['Él se sienta con las piernas cruzadas.', 'Ella se sienta en su regazo, frente a frente.', 'Ella le rodea la cintura con las piernas y ambos se abrazan.'],
    tip: 'Muy íntima: se miran a los ojos todo el tiempo. Muévanse despacio, meciéndose.',
    el:   { h: [128, 166], t: -90, a: [[20, -30], [30, -20]], l: [[-4, 172], [6, 178]] },
    ella: { h: [154, 150], t: -112, a: [[-170, 160], [-160, 165]], l: [[182, 110], [176, 105]] }, front: 'ella' },

  { name: 'La Silla', lvl: 1, scene: 'chair',
    steps: ['Él se sienta en una silla firme y sin brazos.', 'Ella se sienta sobre él, de frente, con los pies en el suelo.', 'Ella se impulsa con las piernas y le abraza el cuello.'],
    tip: 'Usen una silla estable. Ella marca el ritmo con las piernas.',
    el:   { h: [130, 136], t: -95, a: [[-10, -60], [0, -50]], l: [[2, 92], [-4, 88]] },
    ella: { h: [160, 122], t: -112, a: [[-160, -175], [-150, -170]], l: [[45, 95], [55, 100]] }, front: 'ella' },

  { name: 'El Perrito', lvl: 1, scene: 'bed',
    steps: ['Ella se apoya en manos y rodillas sobre la cama.', 'Él se arrodilla detrás de ella.', 'Él la sujeta suavemente por la cadera.'],
    tip: 'Si ella baja el pecho hacia la cama, cambia el ángulo por completo.',
    ella: { h: [172, 122], t: 178, a: [[92, 88], [88, 84]], l: [[98, 2], [102, 0]] },
    el:   { h: [200, 120], t: -102, a: [[150, 175], [140, 170]], l: [[94, 0], [88, 4]] }, front: 'el' },

  { name: 'Las Tijeras', lvl: 1, scene: 'bed',
    steps: ['Los dos se acuestan de lado, en direcciones opuestas.', 'Entrelazan las piernas formando una X.', 'Se mueven juntos desde la cadera.'],
    tip: 'Relajada y cómoda; perfecta para descansar sin perder la cercanía.',
    ella: { h: [140, 148], t: 185, a: [[150, 180], [200, 185]], l: [[-10, 5], [12, 0]] },
    el:   { h: [172, 146], t: -5, a: [[30, 0], [-20, 0]], l: [[172, 180], [190, 185]] } },

  { name: 'La Mariposa', lvl: 2, scene: 'edge',
    steps: ['Ella se recuesta boca arriba al borde de la cama.', 'Él se queda de pie frente a ella.', 'Ella apoya las piernas sobre sus hombros mientras él la sujeta.'],
    tip: 'La altura de la cama es clave: si es baja, él puede flexionar un poco las rodillas.',
    ella: { h: [150, 120], t: 180, a: [[200, 170], [160, 190]], l: [[-38, -80], [-45, -85]] },
    el:   { h: [180, 106], t: -96, a: [[115, -40], [120, -35]], l: [[92, 88], [85, 95]] }, front: 'ella' },

  { name: 'El Yunque', lvl: 2, scene: 'bed',
    steps: ['Ella se recuesta boca arriba y lleva las rodillas hacia el pecho.', 'Él se arrodilla frente a ella.', 'Ella apoya los tobillos sobre sus hombros.'],
    tip: 'Muy intensa: vayan despacio al principio.',
    ella: { h: [145, 148], t: 180, a: [[200, 180], [160, 185]], l: [[-58, -75], [-64, -80]] },
    el:   { h: [180, 120], t: -115, a: [[125, -40], [130, -35]], l: [[95, 2], [88, 0]] }, front: 'ella' },

  { name: 'Boca Abajo', lvl: 2, scene: 'bed',
    steps: ['Ella se acuesta boca abajo con las piernas juntas.', 'Él se recuesta sobre ella, apoyándose en los brazos.', 'Una almohada bajo la cadera de ella ayuda mucho.'],
    tip: 'Con las piernas de ella juntas, la sensación se vuelve más intensa para los dos.',
    ella: { h: [150, 150], t: 180, a: [[180, 180], [170, 190]], l: [[0, 0], [5, 0]] },
    el:   { h: [168, 134], t: 184, a: [[95, 180], [100, 176]], l: [[10, 2], [14, 4]] }, front: 'el' },

  { name: 'Contra la Pared', lvl: 2, scene: 'wall',
    steps: ['Ella se apoya de espaldas a la pared.', 'Él se coloca de frente, muy pegado a ella.', 'Ella sube una pierna y le rodea la cadera.'],
    tip: 'Si hay diferencia de altura, ella puede ponerse sobre un escalón o un libro grueso.',
    ella: { h: [46, 112], t: -90, a: [[-20, -60], [-30, -70]], l: [[88, 92], [-15, 80]] },
    el:   { h: [80, 106], t: -100, a: [[165, 195], [175, 200]], l: [[95, 90], [100, 92]] }, front: 'ella' },

  { name: 'Sobre la Mesa', lvl: 2, scene: 'table',
    steps: ['Ella se sienta en el borde de una mesa firme.', 'Él se queda de pie frente a ella.', 'Ella lo rodea con las piernas y se apoya en sus manos o en su cuello.'],
    tip: 'Revisen que la mesa aguante el peso y esté a la altura de la cadera de él.',
    ella: { h: [118, 112], t: -115, a: [[-40, -10], [160, 100]], l: [[-15, 60], [-5, 70]] },
    el:   { h: [152, 106], t: -98, a: [[170, 200], [160, 190]], l: [[92, 88], [98, 92]] }, front: 'ella' },

  { name: 'En el Sofá', lvl: 2, scene: 'sofa',
    steps: ['Ella se arrodilla en el sofá, mirando al respaldo.', 'Ella apoya los brazos en el respaldo.', 'Él se queda de pie (o de rodillas) detrás de ella.'],
    tip: 'El respaldo le da apoyo a ella; él la sujeta por la cintura.',
    ella: { h: [100, 100], t: 212, a: [[160, 190], [150, 185]], l: [[92, 5], [96, 0]] },
    el:   { h: [140, 106], t: -100, a: [[160, 175], [150, 170]], l: [[95, 90], [85, 88]] }, front: 'el' },

  { name: 'La Silla Invertida', lvl: 2, scene: 'chair',
    steps: ['Él se sienta en una silla firme.', 'Ella se sienta sobre él, de espaldas, con los pies en el suelo.', 'Ella apoya las manos en las rodillas de él para moverse.'],
    tip: 'Él tiene las manos libres para recorrerla entera.',
    el:   { h: [130, 136], t: -95, a: [[20, -20], [30, -10]], l: [[2, 92], [-4, 88]] },
    ella: { h: [150, 124], t: -78, a: [[80, 30], [70, 40]], l: [[30, 92], [40, 96]] }, front: 'ella' },

  { name: 'La Amazona Inclinada', lvl: 2, scene: 'bed',
    steps: ['Él se recuesta boca arriba.', 'Ella se sube encima a horcajadas y se inclina hasta quedar pecho con pecho.', 'Ella apoya los brazos a los lados de su cabeza.'],
    tip: 'Pueden besarse todo el tiempo mientras ella se mueve.',
    el:   { h: [160, 150], t: 180, a: [[-30, 0], [-40, 10]], l: [[2, 0], [-3, 0]] },
    ella: { h: [165, 134], t: 184, a: [[100, 95], [95, 92]], l: [[125, 10], [120, 5]] }, front: 'ella' },

  { name: 'La Carretilla', lvl: 3, scene: 'floor',
    steps: ['Ella se apoya con las manos en el suelo.', 'Él se pone de pie detrás y le levanta las piernas por los muslos.', 'Ella rodea la cintura de él con las piernas.'],
    tip: 'Exige fuerza en los brazos: háganla corta o terminen en la cama.',
    ella: { h: [165, 112], t: 158, a: [[96, 92], [90, 88]], l: [[-6, 2], [4, 10]] },
    el:   { h: [208, 106], t: -95, a: [[155, 180], [165, 185]], l: [[92, 90], [97, 92]] }, front: 'el' },

  { name: 'De Pie en Brazos', lvl: 3, scene: 'floor',
    steps: ['Él está de pie, con las piernas ligeramente abiertas.', 'Ella salta a sus brazos y le rodea la cintura con las piernas.', 'Él la sostiene por los muslos o las nalgas; ella se agarra a su cuello.'],
    tip: 'Si cansa, él puede apoyar la espalda de ella contra una pared.',
    el:   { h: [140, 106], t: -92, a: [[50, -10], [60, -20]], l: [[95, 92], [85, 88]] },
    ella: { h: [160, 104], t: -104, a: [[-160, -175], [-150, -170]], l: [[195, 120], [185, 115]] }, front: 'ella' },

  { name: 'Piernas al Cielo', lvl: 3, scene: 'bed',
    steps: ['Ella se recuesta boca arriba y levanta las piernas rectas hacia el techo.', 'Él se arrodilla frente a ella.', 'Él le sujeta las piernas juntas contra su pecho.'],
    tip: 'Con las piernas juntas la sensación se intensifica mucho.',
    ella: { h: [140, 148], t: 180, a: [[200, 180], [160, 185]], l: [[-82, -88], [-78, -86]] },
    el:   { h: [168, 120], t: -100, a: [[150, -110], [145, -105]], l: [[95, 0], [90, 5]] }, front: 'ella' },

  { name: 'En Cuclillas', lvl: 3, scene: 'bed',
    steps: ['Él se recuesta boca arriba.', 'Ella se pone en cuclillas sobre él, con los pies apoyados en la cama.', 'Ella sube y baja apoyando las manos en su pecho.'],
    tip: 'Muy intensa para ella y un espectáculo para él. Exige piernas fuertes.',
    el:   { h: [165, 150], t: 180, a: [[-140, -170], [-150, -175]], l: [[2, 0], [-3, 0]] },
    ella: { h: [170, 126], t: -76, a: [[120, 100], [112, 95]], l: [[192, 92], [186, 88]] }, front: 'ella' }
];
