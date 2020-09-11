const COLORS = [
  "rgba(141,181,101,1)",
  "rgba(255,99,132,1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(255, 22, 22, 1)",
  "rgba(56, 5, 77, 1)",
  "rgba(239, 230, 53, 1)",
  "rgba(53, 101, 239, 1)"
];

const LIGHT_COLORS = [
  "rgba(141,181,101,0.3)",
  "rgba(255,99,132, 0.3)", // red
  "rgba(54, 162, 235, 0.3)", // bright blue
  "rgba(255, 206, 86, 0.3)",
  "rgba(75, 192, 192, 0.3)",
  "rgba(153, 102, 255, 0.3)",
  "rgba(255, 159, 64, 0.3)",
  "rgba(255, 22, 22, 0.3)",
  "rgba(56, 5, 77, 0.3)",
  "rgba(239, 230, 53, 0.3)",
  "rgba(53, 101, 239, 0.3)"
];

export function getColor(index) {
  return { color: COLORS[index], lightColor: LIGHT_COLORS[index] };
}

export function getColors(n) {
  return COLORS.slice(0, n);
}

export function getLightColors(n) {
  return LIGHT_COLORS.slice(0, n);
}