export type AccessBase = {
  name: string
  passes: number
  table: number
  code: string
}

export type AccessPass = {
  name: string
  table: number
  code: string
  pase: number
}

export const EXCEPTIONS: Record<string, number[]> = {
  'Norma Angelica Fuentes Martinez': [1, 1, 2, 2],
  'Blanca Esthela Dueñas Montes': [1, 1, 1, 2, 3],
  'Anabel Dueñas Montes': [1, 2, 2, 2],
  'Jose Trinidad Fuentes Martinez': [1, 1, 2],
  'Fernando Calderón Calderón': [9, 9, 9],
}

export const ACCESS_BASE: AccessBase[] = [
  { name: 'Norma Angelica Fuentes Martinez', passes: 4, table: 1, code: '411' },
  { name: 'Blanca Esthela Dueñas Montes', passes: 5, table: 1, code: '512' },
  { name: 'Anabel Dueñas Montes', passes: 4, table: 1, code: '412' },
  { name: 'Jose Trinidad Fuentes Martinez', passes: 3, table: 1, code: '311' },
  { name: 'Monica Sanchez Lopez', passes: 2, table: 1, code: '211' },
  { name: 'Alondra Fuentes Quiones', passes: 1, table: 2, code: '122' },
  { name: 'Emili Zepeda Duenas', passes: 1, table: 2, code: '123' },
  { name: 'Nora Patricia Fuentes Martinez', passes: 1, table: 3, code: '131' },
  { name: 'Cuauhtémoc Fuentes Martinez', passes: 1, table: 3, code: '132' },
  { name: 'Mónica Gonzales Martinez', passes: 7, table: 3, code: '713' },
  { name: 'Eloisa Martinez Ruiz', passes: 1, table: 4, code: '141' },
  { name: 'Heriberto Camberos Martinez', passes: 2, table: 4, code: '241' },
  { name: 'Abraham Camberos Martinez', passes: 2, table: 4, code: '242' },
  { name: 'Maria de Jesus Camberos Martinez', passes: 2, table: 4, code: '243' },
  { name: 'Alejandra Delgado Martinez', passes: 2, table: 4, code: '244' },
  { name: 'Mónica Delgado Martinez', passes: 1, table: 4, code: '142' },
  { name: 'Laura Daniela Fuentes Salazar', passes: 1, table: 5, code: '151' },
  { name: 'Deisy Yuliana Alcaraz Zamora', passes: 1, table: 5, code: '152' },
  { name: 'Olivia Elizabeth Velázquez Moran', passes: 1, table: 5, code: '153' },
  { name: 'Alexis Santiago', passes: 1, table: 5, code: '154' },
  { name: 'Jazmin Espinoza', passes: 2, table: 5, code: '251' },
  { name: 'Maria del Pilar Rocha Barragán', passes: 1, table: 5, code: '155' },
  { name: 'Maria Rincón', passes: 1, table: 5, code: '156' },
  { name: 'Luis Manuel Flores', passes: 1, table: 5, code: '157' },
  { name: 'Julieta Salazar', passes: 1, table: 5, code: '158' },
  { name: 'Amaranta Romero', passes: 2, table: 6, code: '261' },
  { name: 'Alejandra Torres', passes: 1, table: 6, code: '161' },
  { name: 'Sugey Barrera', passes: 1, table: 6, code: '162' },
  { name: 'Maria Gálvez Valencia', passes: 1, table: 6, code: '163' },
  { name: 'Jose Ruiz Contreras', passes: 1, table: 6, code: '164' },
  { name: 'Yolanda Guerrero Valencia', passes: 3, table: 6, code: '361' },
  { name: 'Julio Barajas', passes: 1, table: 6, code: '165' },
  { name: 'Isvi Fabian', passes: 1, table: 10, code: '171' },
  { name: 'Homero sanchez', passes: 2, table: 7, code: '271' },
  { name: 'Martha Torres', passes: 2, table: 7, code: '172' },
  { name: 'Andrea Torres', passes: 1, table: 7, code: '173' },
  { name: 'Nayeli Hurtado', passes: 1, table: 7, code: '174' },
  { name: 'Alberto Vargas', passes: 2, table: 7, code: '272' },
  { name: 'Irving Paul Fuentes', passes: 2, table: 7, code: '273' },
  { name: 'Tania Murillo', passes: 2, table: 8, code: '281' },
  { name: 'Mayra Martinez', passes: 2, table: 8, code: '282' },
  { name: 'Erika Aguirre', passes: 2, table: 8, code: '283' },
  { name: 'Alejandra Reyes', passes: 2, table: 8, code: '284' },
  { name: 'Fatima castrejón', passes: 2, table: 8, code: '285' },
  { name: 'Fernando Calderón Calderón', passes: 3, table: 9, code: '391' },
  { name: 'Rodrigo Arcila', passes: 2, table: 9, code: '291' },
  { name: 'Diego Arcila', passes: 2, table: 9, code: '292' },
  { name: 'Victor Hugo Nuñez', passes: 2, table: 9, code: '293' },
  { name: 'Salvador Morales Rocha', passes: 1, table: 9, code: '294' },
  { name: 'Vicente Rodriguez', passes: 4, table: 10, code: '201' },
  { name: 'Fernando Berber', passes: 1, table: 10, code: '101' },
  { name: 'Robertito Rodriguez', passes: 2, table: 10, code: '202' },
  { name: 'Rodrigo Rodriguez Primo', passes: 1, table: 10, code: '102' },
  { name: 'Maheli Rodriguez', passes: 1, table: 10, code: '103' },
  { name: 'Victor Robledo', passes: 2, table: 10, code: '203' },
  { name: 'Roberto Rodriguez', passes: 2, table: 11, code: '212' },
  { name: 'Antonio Rodriguez', passes: 2, table: 11, code: '213' },
  { name: 'Brenda Rodriguez', passes: 2, table: 11, code: '214' },
  { name: 'Rodrigo Rubio', passes: 2, table: 11, code: '215' },
  { name: 'Yaritza Rodríguez', passes: 2, table: 11, code: '216' },
  { name: 'Sara Peñaloza', passes: 3, table: 12, code: '321' },
  { name: 'Edith Peñaloza', passes: 2, table: 12, code: '221' },
  { name: 'Saul tiznado', passes: 1, table: 12, code: '124' },
  { name: 'Rodain Trejo', passes: 1, table: 12, code: '125' },
  { name: 'Jonathan Jair', passes: 1, table: 12, code: '126' },
  { name: 'Fernando Vargas', passes: 1, table: 12, code: '127' },
  { name: 'Raquel Peñaloza', passes: 1, table: 12, code: '128' },
]

export function expandAccess(base: AccessBase[], exceptions: Record<string, number[]>): AccessPass[] {
  const arr: AccessPass[] = []
  for (const b of base) {
    const exc = exceptions[b.name]
    if (exc) {
      exc.forEach((mesa, i) => {
        arr.push({ name: b.name, table: mesa, code: b.code, pase: i + 1 })
      })
      continue
    }
    for (let i = 0; i < b.passes; i++) {
      arr.push({ name: b.name, table: b.table, code: b.code, pase: i + 1 })
    }
  }
  return arr
}
