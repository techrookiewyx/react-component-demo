import React from 'react';
import { createRoot } from 'react-dom/client';
import '@wcj/dark-mode';
import MarkdownPreviewExample from '@uiw/react-markdown-preview-example';
import data from '@wyxin/react-component-demo/README.md';

import ComponentDemo from '@wyxin/react-component-demo';

const Github = MarkdownPreviewExample.Github;
const Example = MarkdownPreviewExample.Example;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <MarkdownPreviewExample
    source={data.source}
    components={data.components}
    data={data.data}
    description="React component that handles csv file input and its parsing."
    title="Component Demo"
    version={`v${VERSION}`}
  >
    <Github href="https://github.com/uiwjs/react-csv-reader" />
    <Example>
      <ComponentDemo />
    </Example>
    ssss
  </MarkdownPreviewExample>,
);
