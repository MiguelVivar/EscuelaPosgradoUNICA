export interface Authority {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string | { default: string }; // string for URL paths or imported images
  resolution: string;
  externalLink?: string;
}

export interface AuthorityCardProps {
  authority: Authority;
}

export interface AuthorityGridProps {
  authorities: Authority[];
}

export interface AuthorityPageHeaderProps {
  title: string;
  subtitle?: string;
}
