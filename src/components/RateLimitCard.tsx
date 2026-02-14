import React from 'react';

interface ResourceData {
  limit: number;
  used: number;
  remaining: number;
  reset: number;
}

interface RateLimitCardProps {
  title: string;
  data: ResourceData;
}

const descriptions: { [key: string]: string } = {
  core: "General API calls including most endpoints",
  search: "Search API for repositories, users, and code",
  graphql: "GraphQL API queries and mutations",
  integration_manifest: "Integration manifest API",
  source_import: "Source import API",
  code_scanning_upload: "Code scanning upload API",
  code_scanning_autofix: "Code scanning autofix API",
  actions_runner_registration: "Actions runner registration API",
  scim: "SCIM API for user management",
  dependency_snapshots: "Dependency snapshots API",
  dependency_sbom: "Dependency SBOM API",
  audit_log: "Audit log API",
  audit_log_streaming: "Audit log streaming API",
  code_search: "Code search API"
};

const links: { [key: string]: string } = {
  core: "https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting",
  search: "https://docs.github.com/en/rest/search",
  graphql: "https://docs.github.com/en/graphql/overview/rate-limits-and-node-limits-for-the-graphql-api",
  integration_manifest: "https://docs.github.com/en/apps/creating-github-apps/setting-up-a-github-app/creating-a-github-app-from-a-manifest",
  source_import: "https://docs.github.com/en/migrations/using-githubs-migrations-api/migrating-repositories-to-github",
  code_scanning_upload: "https://docs.github.com/en/code-security/code-scanning",
  code_scanning_autofix: "https://docs.github.com/en/code-security/code-scanning",
  actions_runner_registration: "https://docs.github.com/en/actions/hosting-your-own-runners",
  scim: "https://docs.github.com/en/enterprise-cloud@latest/rest/scim",
  dependency_snapshots: "https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review",
  dependency_sbom: "https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review",
  audit_log: "https://docs.github.com/en/enterprise-cloud@latest/rest/enterprise-admin/audit-log",
  audit_log_streaming: "https://docs.github.com/en/enterprise-cloud@latest/rest/enterprise-admin/audit-log",
  code_search: "https://docs.github.com/en/search-github/github-code-search"
};

export const RateLimitCard: React.FC<RateLimitCardProps> = ({ title, data }) => {
  const { limit, used, remaining, reset } = data;
  
  // Calculate percentage used
  const percentageUsed = limit > 0 ? (used / limit) * 100 : 0;
  const percentageRemaining = limit > 0 ? (remaining / limit) * 100 : 0;

  // Determine color based on remaining percentage
  let colorClass = "bg-green-500";
  if (percentageRemaining < 20) colorClass = "bg-red-500";
  else if (percentageRemaining < 50) colorClass = "bg-yellow-500";

  // Format reset time
  const resetDate = new Date(reset * 1000);
  const timeString = resetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // Calculate relative time (e.g., "in 15 mins")
  const now = new Date();
  const diffMs = resetDate.getTime() - now.getTime();
  const diffMins = Math.ceil(diffMs / 60000);
  const relativeTime = diffMins > 0 ? `in ${diffMins} min${diffMins !== 1 ? 's' : ''}` : "Resetting soon";

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 capitalize">
            {title.replace(/_/g, ' ')}
          </h3>
          <div className="relative">
            <span className="text-gray-400 dark:text-gray-500 cursor-help text-sm">ⓘ</span>
            <div className="absolute left-0 top-6 w-64 p-3 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-gray-600 dark:border-gray-400">
              {descriptions[title] || "GitHub API rate limit"}
            </div>
          </div>
          {links[title] && (
            <a 
              href={links[title]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm transition-colors"
              title="View GitHub documentation"
            >
              📄
            </a>
          )}
        </div>
        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {remaining} / {limit}
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`} 
          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">Used</p>
          <p className="font-semibold">{used}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 dark:text-gray-400 text-xs">Reset</p>
          <p className="font-semibold" title={resetDate.toLocaleString()}>
            {timeString} <span className="text-xs font-normal text-gray-500">({relativeTime})</span>
          </p>
        </div>
      </div>
    </div>
  );
};
