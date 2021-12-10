import { readInput } from '../utils';

readInput(4, 2020).then(input => {
  //   input = `ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
  // byr:1937 iyr:2017 cid:147 hgt:183cm

  // iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
  // hcl:#cfa07d byr:1929

  // hcl:#ae17e1 iyr:2013
  // eyr:2024
  // ecl:brn pid:760753108 byr:1931
  // hgt:179cm

  // hcl:#cfa07d eyr:2025 pid:166559648
  // iyr:2011 ecl:brn hgt:59in
  //   `;// example input
  //   input = `eyr:1972 cid:100
  // hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

  // iyr:2019
  // hcl:#602927 eyr:1967 hgt:170cm
  // ecl:grn pid:012533040 byr:1946

  // hcl:dab227 iyr:2012
  // ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

  // hgt:59cm ecl:zzz
  // eyr:2038 hcl:74454a iyr:2023
  // pid:3556412378 byr:2007

  // pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
  // hcl:#623a2f

  // eyr:2029 ecl:blu cid:129 byr:1989
  // iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

  // hcl:#888785
  // hgt:164cm byr:2001 iyr:2015 cid:88
  // pid:545766238 ecl:hzl
  // eyr:2022

  // iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`;
  //   console.log(input);
  const passports = input.split('\n\n').map(
    p => p.split(/[ \n]{1}/).reduce(
      (prev: object, cur: string) => ({ ...prev, [cur.split(':')[0]]: cur.split(':')[1] })
      , {})
  );
          type MatchFn = {
            (v: string): boolean
          }
          const keys: { key: string, matchFn: MatchFn }[] = [
            {
              key: 'byr',
              matchFn: (v: string): boolean => /\d{4}/.test(v) && parseInt(v) >= 1920 && parseInt(v) <= 2002
            },
            {
              key: 'iyr',
              matchFn: (v: string): boolean => /\d{4}/.test(v) && parseInt(v) >= 2010 && parseInt(v) <= 2020
            },
            {
              key: 'eyr',
              matchFn: (v: string): boolean => /\d{4}/.test(v) && parseInt(v) >= 2020 && parseInt(v) <= 2030
            },
            {
              key: 'hgt',
              matchFn: (v: string): boolean => {
                if (/\d+[cm|in]/.test(v)) {
                  const n = parseInt(v.substring(0, v.length - 2));
                  return (v.endsWith('cm') && n >= 150 && n <= 193) || (v.endsWith('in') && n >= 59 && n <= 76);
                }
                return false;
              }
            },
            {
              key: 'hcl',
              matchFn: (v: string): boolean => /^#[0-9a-f]{6}$/.test(v)
            },
            {
              key: 'ecl',
              matchFn: (v: string): boolean => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(v)
            },
            {
              key: 'pid',
              matchFn: (v: string): boolean => /^\d{9}$/.test(v)
            }
          ];
          let valids = 0;
          passports.forEach(p => {
            let valid = true;
            keys.forEach(kp => {
              if (!(kp.key in p)) {
                valid = false;
              }
            });
            valids += valid ? 1 : 0;
          });
          console.log('4.1', valids);

          valids = 0;
          passports.forEach((p: any) => {
            let valid = true;
            for (const kp of keys) {
              if (!(kp.key in p) || !kp.matchFn(p[kp.key])) {
                valid = false;
                break;
              }
            };
            valids += valid ? 1 : 0;
          });
          console.log('4.2', valids);
});
