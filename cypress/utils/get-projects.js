// See https://cyf-auto-gallery.glitch.me

const githubUsers = [
  "279Roxana",
  // "abbasmokhtari",
  "abcelen",
  // "AKaramifar",
  // "AlexandruBudaca",
  // "AlexeyBrambalov",
  // "Alisina92",
  // "babakjahangiri",
  // "banirezaie",
  // "byohannes",
  "cockochan",
  // "cyeburu",
  // "ellietms",
  // "Erwin6997",
  // "ferhatu",
  // "Hamidreza-Fakharzadeh",
  // "Hanifix",
  // "HarrisSheraz20",
  // "kiowd",
  // "leealex88",
  // "mahmutsel",
  // "melanieet",
  // "minwwgo",
  // "mnashawati",
  "naderakhgari",
  // "Rayhan94",
  // "sabia-m",
  // "SCavus",
  // "Sonjide",
  // "sugunum",
  // "TamBahri",
  // "tanianm",
  // "tayfuntayfun",
  // "yusuf963",
];

export default function getProjects() {
  return githubUsers.map((githubUser) => ({
    githubUser,
    baseUrl: `https://cyf-${githubUser}-tv.netlify.app`,
  }));
}
