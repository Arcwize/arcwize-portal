export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const WIX_API_KEY = "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjIyMjUxODY5LWQ2MWMtNGY0MS05YzI2LTBkMjQzYjVkNTIzN1wiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcImU4OTFmMzg5LTczNGMtNGM4MS1hNzEzLWZlZDE4MWFkMjQ1ZFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI4ZDczYzY1OC0wYzc2LTQzZjUtYmYzYi02MTdlYjAyMDAwZjdcIn19IiwiaWF0IjoxNzc3MDg3OTQ5fQ.if8Bz_cNjMtLGNVqU1ZADNRuZMXDFq0YxA0sISSAyGuxVFdvo_R638wVseieZTouyk6jmYk03x9zca1hnRDOD9dmSv-L_u__JQh7sLPK7EOWfA0OnZHAO0iWxDEPSnAxKnAaGOpZQXCT3-EakYV-K1xKXUsVZd3OppZIB-umxdQIV5JBP-kxHUkL7c8vqA__gIXWiYLli1AZK27awBJjlbpYErwf7WqBAr8XszLYRbZw-4rm7rqFy1q4kTHMOTEdHjbbmtdna9GeI-wf95QHvTUAkwCPg_VpIeWd0aw96WTucCzGRMc-iJrpB0mhpx4UfB8qZBqcH5pAiqB2qTWUbg";
  const WIX_SITE_ID = "455c12fa-d597-4a3e-ba87-1e6c51e493e8";

  try {
    const response = await fetch("https://www.wixapis.com/blog/v3/draft-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": WIX_API_KEY,
        "wix-site-id": WIX_SITE_ID,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to submit to Wix", details: error.message });
  }
}
