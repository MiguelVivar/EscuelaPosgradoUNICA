import React from 'react';

interface AuthorityInfoProps {
  name: string;
  title: string;
}

const AuthorityInfo: React.FC<AuthorityInfoProps> = ({ name, title }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-zinc-800">
        {name}
      </h2>
      <p className="text-zinc-600">
        {title}
      </p>
    </div>
  );
};

export default AuthorityInfo;
