import Link from 'next/link';
import { SectionHeading } from './SectionHeading';
import { BodyText } from './BodyText';

interface TempleCardProps {
  title: string;
  description: string;
  href: string;
}

export function TempleCard({ title, description, href }: TempleCardProps) {
  return (
    <div className="temple-card">
      <div className="temple-card-image-placeholder"></div>
      <div className="temple-card-content">
        <SectionHeading className="temple-card-title">{title}</SectionHeading>
        <BodyText className="temple-card-desc">{description}</BodyText>
        <Link href={href} className="temple-card-link">Learn more &rarr;</Link>
      </div>
    </div>
  );
}
