import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Acknowledgments - TiendaFit',
  description: 'Recognition of security researchers who have helped improve TiendaFit platform security',
  robots: 'index, follow'
}

interface SecurityContributor {
  name: string
  findings: string[]
  date: string
  website?: string
  twitter?: string
}

// This would typically be loaded from a database or CMS
const securityContributors: SecurityContributor[] = [
  // Example entries - replace with actual contributors when available
  {
    name: "Security Research Team",
    findings: [
      "Initial security audit and recommendations",
      "Implementation of comprehensive CSP",
      "Rate limiting optimization"
    ],
    date: "2025-01-27",
    website: "https://github.com/RAguina/tiendaFit"
  }
]

export default function SecurityAcknowledgmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Security Acknowledgments
          </h1>

          <div className="mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              We extend our sincere gratitude to the security researchers and ethical hackers 
              who have responsibly disclosed vulnerabilities and helped improve the security 
              of TiendaFit platform.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                🛡️ Our Commitment to Security
              </h2>
              <p className="text-blue-800 dark:text-blue-200">
                Security is a collaborative effort. We believe in working together with the 
                security community to create a safer platform for all our users.
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Hall of Fame
            </h2>

            {securityContributors.length > 0 ? (
              <div className="space-y-6">
                {securityContributors.map((contributor, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {contributor.website ? (
                            <a 
                              href={contributor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {contributor.name}
                            </a>
                          ) : (
                            contributor.name
                          )}
                        </h3>
                        {contributor.twitter && (
                          <a 
                            href={`https://twitter.com/${contributor.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                          >
                            @{contributor.twitter}
                          </a>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(contributor.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Security Contributions:
                      </h4>
                      <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                        {contributor.findings.map((finding, findingIndex) => (
                          <li key={findingIndex} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Be the First Contributor!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Help us improve our security and earn recognition in our Hall of Fame.
                </p>
                <a 
                  href="/security-policy"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  View Reporting Guidelines
                </a>
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Recognition Criteria
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                  🥇 Hall of Fame
                </h3>
                <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
                  <li>• Valid security vulnerabilities</li>
                  <li>• Responsible disclosure followed</li>
                  <li>• Clear impact demonstration</li>
                  <li>• Constructive reporting approach</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                  🏅 Special Recognition
                </h3>
                <ul className="text-yellow-800 dark:text-yellow-200 space-y-2 text-sm">
                  <li>• Critical security findings</li>
                  <li>• Novel attack vectors</li>
                  <li>• Multiple vulnerability reports</li>
                  <li>• Security improvement suggestions</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Security Statistics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {securityContributors.length}
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-200">Contributors</div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {securityContributors.reduce((acc, c) => acc + c.findings.length, 0)}
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">Issues Fixed</div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  9.5/10
                </div>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">Security Score</div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  &lt; 48h
                </div>
                <div className="text-sm text-purple-800 dark:text-purple-200">Response Time</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Ready to contribute to our security? We'd love to hear from you!
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500">📧</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Email: <a href="mailto:security@tiendafit.com" className="text-blue-600 dark:text-blue-400 hover:underline">security@tiendafit.com</a>
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500">🔒</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    GitHub: <a href="https://github.com/RAguina/tiendaFit/security/advisories/new" className="text-blue-600 dark:text-blue-400 hover:underline">Security Advisory</a>
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-blue-500">📋</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    Policy: <a href="/security-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Security Policy</a>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Thank you for helping keep TiendaFit secure for everyone! 🙏
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}