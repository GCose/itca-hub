import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useResourceAdmin from '@/hooks/resources/use-resource-admin';
import { ResourceAnalyticsProps, ResourceAnalyticsData } from '@/types/interfaces/modal';

const ResourceAnalytics = ({ token, isOpen = true, resource, onClose }: ResourceAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'views' | 'downloads'>('overview');
  const [analytics, setAnalytics] = useState<ResourceAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getResourceAnalytics } = useResourceAdmin({ token });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!resource || !token || !isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await getResourceAnalytics(resource._id);
        setAnalytics(data);
      } catch {
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [resource, token, getResourceAnalytics, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/*==================== Modal Header ====================*/}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {resource.title} - Analytics
                    <span className="ml-2 relative">
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                      </span>
                    </span>
                  </h3>
                </div>

                <button
                  type="button"
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Loading State ====================*/}
              {isLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-purple-600 rounded-full border-t-transparent"></div>
                </div>
              )}
              {/*==================== End of Loading State ====================*/}

              {/*==================== Error State ====================*/}
              {!isLoading && error && (
                <div className="flex flex-col items-center justify-center h-64">
                  <p className="text-center text-gray-500 mb-4">{error}</p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Close
                  </button>
                </div>
              )}
              {/*==================== End of Error State ====================*/}

              {/*==================== Analytics Content ====================*/}
              {!isLoading && !error && analytics && (
                <>
                  {/*==================== Tab Navigation ====================*/}
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'overview'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'views'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('views')}
                    >
                      Views
                    </button>
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        activeTab === 'downloads'
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('downloads')}
                    >
                      Downloads
                    </button>
                  </div>
                  {/*==================== End of Tab Navigation ====================*/}

                  {/*==================== Overview Tab ====================*/}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      {/*==================== Stats Grid ====================*/}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {analytics.views || 0}
                          </div>
                          <div className="text-sm text-gray-600">Total Views</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {analytics.downloads || 0}
                          </div>
                          <div className="text-sm text-gray-600">Total Downloads</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {analytics.uniqueViewers || 0}
                          </div>
                          <div className="text-sm text-gray-600">Unique Viewers</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {analytics.uniqueDownloaders || 0}
                          </div>
                          <div className="text-sm text-gray-600">Unique Downloaders</div>
                        </div>
                      </div>
                      {/*==================== End of Stats Grid ====================*/}

                      {/*==================== Resource Details ====================*/}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-3">Resource Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <span className="ml-2 font-medium">
                              {analytics.resource?.category || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Department:</span>
                            <span className="ml-2 font-medium">
                              {analytics.resource?.department || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Academic Level:</span>
                            <span className="ml-2 font-medium">
                              {analytics.resource?.academicLevel || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Visibility:</span>
                            <span className="ml-2 font-medium">
                              {analytics.resource?.visibility || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/*==================== End of Resource Details ====================*/}
                    </div>
                  )}
                  {/*==================== End of Overview Tab ====================*/}

                  {/*==================== Views Tab ====================*/}
                  {activeTab === 'views' && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Views by Day</h3>
                      {analytics.viewsByDay && analytics.viewsByDay.length > 0 ? (
                        <div className="space-y-2">
                          {analytics.viewsByDay.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-blue-50 rounded"
                            >
                              <span className="text-sm text-gray-700">{item.date}</span>
                              <span className="font-medium text-blue-600">{item.count} views</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No view data available</p>
                      )}
                    </div>
                  )}
                  {/*==================== End of Views Tab ====================*/}

                  {/*==================== Downloads Tab ====================*/}
                  {activeTab === 'downloads' && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">Downloads by Day</h3>
                      {analytics.downloadsByDay && analytics.downloadsByDay.length > 0 ? (
                        <div className="space-y-2">
                          {analytics.downloadsByDay.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-green-50 rounded"
                            >
                              <span className="text-sm text-gray-700">{item.date}</span>
                              <span className="font-medium text-green-600">
                                {item.count} downloads
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No download data available</p>
                      )}
                    </div>
                  )}
                  {/*==================== End of Downloads Tab ====================*/}
                </>
              )}
              {/*==================== End of Analytics Content ====================*/}

              {/*==================== Close Button ====================*/}
              {!isLoading && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
              {/*==================== End of Close Button ====================*/}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResourceAnalytics;
