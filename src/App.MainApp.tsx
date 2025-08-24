import React from 'react';
import PostcodeScraperApp from './App.PostcodeScraperApp';

// This is a wrapper to ensure the new UI is rendered
// Replace your old app import with this component
const MainApp: React.FC = () => {
  React.useEffect(() => {
    console.log('🔄 MainApp wrapper loaded - rendering new PostcodeScraperApp');
  }, []);

  return <PostcodeScraperApp />;
};

export default MainApp;