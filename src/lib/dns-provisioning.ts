/**
 * Automatically provision subdomain DNS and Vercel configuration
 * when a vendor store is approved
 */

interface ProvisionResult {
  success: boolean;
  cloudflare?: { success: boolean; recordId?: string; error?: string };
  vercel?: { success: boolean; error?: string };
}

/**
 * Add CNAME record to Cloudflare DNS
 */
async function addCloudflareRecord(subdomain: string): Promise<{ success: boolean; recordId?: string; error?: string }> {
  const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
    console.error("Missing Cloudflare credentials");
    return { success: false, error: "Missing Cloudflare credentials" };
  }

  try {
    // Get the Vercel DNS target from www.dude.box's current CNAME
    const vercelTarget = "cb582a877b4be2de.vercel-dns-016.com"; // Your specific Vercel DNS address

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CNAME",
          name: `${subdomain}.dude.box`,
          content: vercelTarget,
          ttl: 1, // Auto TTL
          proxied: false, // Must be false for Vercel
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Cloudflare API error:", data);
      return { success: false, error: data.errors?.[0]?.message || "Failed to create DNS record" };
    }

    console.log(`✅ Cloudflare DNS record created for ${subdomain}.dude.box`);
    return { success: true, recordId: data.result.id };
  } catch (error) {
    console.error("Error adding Cloudflare record:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Add domain to Vercel project
 */
async function addVercelDomain(subdomain: string): Promise<{ success: boolean; error?: string }> {
  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional

  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    console.error("Missing Vercel credentials");
    return { success: false, error: "Missing Vercel credentials" };
  }

  try {
    const domain = `${subdomain}.dude.box`;
    const url = VERCEL_TEAM_ID
      ? `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains?teamId=${VERCEL_TEAM_ID}`
      : `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: domain,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Domain might already exist - check if that's the error
      if (data.error?.code === "domain_already_in_use" || data.error?.code === "domain_exists") {
        console.log(`ℹ️ Domain ${domain} already exists in Vercel`);
        return { success: true };
      }
      
      console.error("Vercel API error:", data);
      return { success: false, error: data.error?.message || "Failed to add domain" };
    }

    console.log(`✅ Vercel domain added: ${domain}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding Vercel domain:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Provision subdomain DNS and Vercel configuration
 * This runs asynchronously and doesn't block store approval
 */
export async function provisionStoreSubdomain(subdomain: string): Promise<ProvisionResult> {
  console.log(`🚀 Provisioning subdomain: ${subdomain}.dude.box`);

  // Step 1: Add DNS record to Cloudflare
  const cloudflareResult = await addCloudflareRecord(subdomain);

  // Step 2: Add domain to Vercel project
  const vercelResult = await addVercelDomain(subdomain);

  const success = cloudflareResult.success && vercelResult.success;

  if (success) {
    console.log(`✅ Subdomain provisioned successfully: ${subdomain}.dude.box`);
    console.log(`ℹ️ SSL certificate will be issued by Vercel automatically (may take 1-2 minutes)`);
  } else {
    console.error(`❌ Subdomain provisioning failed for ${subdomain}.dude.box`);
  }

  return {
    success,
    cloudflare: cloudflareResult,
    vercel: vercelResult,
  };
}

/**
 * Remove subdomain when store is deleted/suspended
 * Optional - keeps DNS clean
 */
export async function deprovisionStoreSubdomain(subdomain: string): Promise<void> {
  // Implementation for cleanup (optional)
  console.log(`🗑️ Deprovisioning ${subdomain}.dude.box (not implemented yet)`);
}
