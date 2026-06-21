export function getHavenProfile() {
  return (
    JSON.parse(
      localStorage.getItem("havenProfile")
    ) || {
  name: "",
  role: "",
  field: "",
  year: "",
  goals: [],
  support_style: "",
  support_ranking: [],
  theme: "midnight",
}
  );
}