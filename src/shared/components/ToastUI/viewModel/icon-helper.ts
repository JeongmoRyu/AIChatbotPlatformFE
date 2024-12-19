import { createElement } from 'react';
import * as Icons from 'lucide-react';

interface MaumIconsProps {
  icon: keyof typeof Icons;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  title?: string;
}

function MaumIcons(props: MaumIconsProps) {
  try {
    const { icon, className = '', title = '', ...computedProps } = props;
    const IconComponent = Icons[icon] as React.ComponentType<any>;
    if (IconComponent) {
      return createElement(IconComponent, {
        ...computedProps,
        className: `maum-icons ${className}`,
        title: title,
      });
    } else {
      console.error(`Icon '${icon}' not found.`);
      return null;
    }
  } catch (err) {
    throw `icon '${props.icon}' not found.`;
  }
}

export default MaumIcons;
