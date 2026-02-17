import type { MDXComponents } from "mdx/types";
import { CodeBlock } from '@/components/code-block';
import { ReactNode } from 'react';

interface PreProps {
  children?: ReactNode;
  [key: string]: unknown;
}

interface CodeProps {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    // Sobrescribir el componente de código para usar syntax highlighting
    pre: ({ children, ...props }: PreProps) => {
      // Extraer el código y el lenguaje del elemento code hijo
      if (children && typeof children === 'object' && 'props' in children) {
        const childProps = (children as { props: { className?: string; children?: string } }).props;
        if (childProps?.className) {
          const language = childProps.className.replace('language-', '') || 'text';
          const code = childProps.children || '';
          return <CodeBlock code={code} language={language} />;
        }
      }
      return <pre {...props}>{children}</pre>;
    },
    code: ({ children, className, ...props }: CodeProps) => {
      // Si tiene className con language-, es un bloque de código
      if (className?.startsWith('language-')) {
        const language = className.replace('language-', '');
        return <CodeBlock code={String(children || '')} language={language} />;
      }
      // Si no, es código inline
      return <code className={className} {...props}>{children}</code>;
    },
    ...components,
  };
}
