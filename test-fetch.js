// Test if some query parameter can increase the record count returned per page
Promise.all([
  fetch("https://admin.placbillstrack.org/api/bills?per_page=100").then(res => res.json()),
  fetch("https://admin.placbillstrack.org/api/bills?limit=100").then(res => res.json()),
  fetch("https://admin.placbillstrack.org/api/bills?size=100").then(res => res.json())
]).then(([res1, res2, res3]) => {
  console.log("per_page=100 count:", res1?.data?.data?.length, "per_page:", res1?.data?.per_page);
  console.log("limit=100 count:", res2?.data?.data?.length, "per_page:", res2?.data?.per_page);
  console.log("size=100 count:", res3?.data?.data?.length, "per_page:", res3?.data?.per_page);
}).catch(err => {
  console.error("ERROR:", err.message);
});
