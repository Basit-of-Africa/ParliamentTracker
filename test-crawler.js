const startTime = Date.now();

// Fetch first page to get total pages
fetch("https://admin.placbillstrack.org/api/bills?page=1")
  .then(res => res.json())
  .then(async root => {
    const total = root.data.total;
    const perPage = root.data.per_page;
    const lastPage = root.data.last_page;
    console.log(`Total bills: ${total}, Per page: ${perPage}, Last page: ${lastPage}`);

    const pagesToFetch = Array.from({ length: 50 }, (_, i) => i + 1); // Test first 50 pages
    console.log(`Testing concurrent fetch of ${pagesToFetch.length} pages...`);

    const results = [];
    const concurrency = 20; // 20 requests at a time
    for (let i = 0; i < pagesToFetch.length; i += concurrency) {
      const chunk = pagesToFetch.slice(i, i + concurrency);
      const promises = chunk.map(page => 
        fetch(`https://admin.placbillstrack.org/api/bills?page=${page}`)
          .then(res => res.json())
          .then(resJson => {
            if (resJson?.data?.data) {
              results.push(...resJson.data.data);
            }
          })
          .catch(e => {
            console.error(`Page ${page} failed:`, e.message);
          })
      );
      await Promise.all(promises);
      console.log(`Completed fetching pages up to ${i + chunk.length}. Total bills parsed so far: ${results.length}`);
    }

    console.log(`Done chunk fetch of 50 pages in ${Date.now() - startTime}ms. Parsed ${results.length} bills.`);
  })
  .catch(err => {
    console.error("Failed to fetch root page:", err.message);
  });
