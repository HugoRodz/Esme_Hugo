import fs from 'fs';
import path from 'path';

// Simple CSV parser for this controlled input
function parseCSV(text) {
  return text
    .trim()
    .split(/\n+/)
    .map(line => line.split('\t').map(s => s.trim()));
}

const input = `Nombre	pases	Mesa	Codigo de verificacion
Norma Angelica Fuentes Martinez	4	1	411
Blanca Esthela Dueñas Montes	5	1	512
Anabel Dueñas Montes	4	1	412
Jose Trinidad Fuentes Martinez	3	1	311
Monica Sanchez Lopez	2	1	211
Irvin Paul Fuentes Quiones	1	2	121
Alondra Fuentes Quiones	1	2	122
Emili Zepeda Duenas	1	2	123
Nora Patricia Fuentes Martinez	1	3	131
Cuauhtémoc Fuentes Martinez	1	3	132
Mónica Gonzales Martinez	7	3	713
Eloisa Martinez Ruiz	1	4	141
Heriberto Camberos Martinez	2	4	241
Abraham Camberos Martinez	2	4	242
Maria de Jesus Camberos Martinez	2	4	243
Alejandra Delgado Martinez	2	4	244
Mónica Delgado Martinez	1	4	142
Laura Daniela Fuentes Salazar	1	5	151
Deisy Yuliana Alcaraz Zamora	1	5	152
Olivia Elizabeth Velázquez Moran	1	5	153
Alexis Santiago	1	5	154
Jazmin Espinoza	2	5	251
Maria del Pilar Rocha Barragán	1	5	155
Maria Rincón	1	5	156
Luis Manuel Flores	1	5	157
Julieta Salazar	1	5	158
Amaranta Romero	2	6	261
Alejandra Torres	1	6	161
Sugey Barrera	1	6	162
Maria Gálvez Valencia	1	6	163
Adriana Flores Cardenas	1	6	164
Yolanda Guerrero Valencia	3	6	361
Julio Barajas	1	6	165
Isvi Fabian	1	7	171
Homero sanchez	2	7	271
Martha Torres	1	7	172
Andrea Torres	1	7	173
Nayeli Hurtado	1	7	174
Hector Salazar	2	7	272
Angelica Ramirez Navarro	2	7	273
Tania Murillo	2	8	281
Mayra Martinez	2	8	282
Erika Aguirre	2	8	283
Alejandra Reyes	2	8	284
Fatima castrejón	2	8	285
Fernando Calderón Calderón	3	9	391
Rodrigo Arcila	2	9	291
Diego Arcila	2	9	292
Victor Hugo Nuñez	2	9	293
Israel Calderon	2	9	294
Naviel Berber	2	10	201
Fernando Berber	1	10	101
Robertito Rodriguez	2	10	202
Rodrigo Rodriguez Primo	1	10	102
Maheli Rodriguez	1	10	103
Victor Robledo	2	10	203
Roberto Rodriguez	2	11	212
Antonio Rodriguez	2	11	213
Brenda Rodriguez	2	11	214
Rodrigo Rubio	2	11	215
Yaritza Rodríguez	2	11	216
Sara Peñaloza	3	12	321
Edith Peñaloza	2	12	221
Saul tiznado	1	12	124
Rodain Trejo	1	12	125
Jonathan Jair	1	12	126
Fernando Vargas	1	12	127
Raquel Peñaloza	1	12	128`;

const rows = parseCSV(input);
const header = rows.shift();

// Exceptions mapping by normalized name
const exceptions = {
  'Norma Angelica Fuentes Martinez': [1,1,2,2], // 4 pases -> two in mesa1, two in mesa2
  'Blanca Esthela Dueñas Montes': [1,1,1,2,3], // 5 pases -> three m1, one m2, one m3
  'Anabel Dueñas Montes': [1,2,2,2], // 4 -> one m1, three m2
  'Jose Trinidad Fuentes Martinez': [1,1,2], // 3 -> two m1, one m2
  'Fernando Calderón Calderón': [9,9,10] // 3 -> two m9, one m10
};

const expanded = [];
let ticketId = 1;
for (const r of rows) {
  const [nombre, pasesStr, mesaStr, codigo] = r;
  const pases = Number(pasesStr) || 1;
  const defaultMesa = mesaStr || '';

  const key = nombre.trim();
  if (exceptions[key]) {
    const arrangement = exceptions[key];
    for (let i = 0; i < arrangement.length; i++) {
      const mesa = arrangement[i];
      expanded.push({
        id: ticketId++,
        nombre: key,
        paseIndex: i + 1,
        mesa: String(mesa),
        codigo
      });
    }
    continue;
  }

  // default: put all pases in the listed mesa
  for (let i = 0; i < pases; i++) {
    expanded.push({
      id: ticketId++,
      nombre: key,
      paseIndex: i + 1,
      mesa: defaultMesa,
      codigo
    });
  }
}

// Ensure dist folder
const outDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, 'access-expanded.csv');
const outCsv = ['id,nombre,pase,mesa,codigo'];
for (const e of expanded) {
  outCsv.push(`${e.id},"${e.nombre}",${e.paseIndex},${e.mesa},${e.codigo}`);
}
fs.writeFileSync(outPath, outCsv.join('\n'));
console.log('Generado:', outPath);
