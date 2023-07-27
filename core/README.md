react-component-demo
===

## Example

```tsx mdx:preview
import React, { useState } from 'react';
import Example from '@wyxin/react-component-demo';

export default function Demo() {
  const [value, setValue] = useState([]);
  return (
    <React.Fragment>
      XXX
      <Example title="yongxin" />
    </React.Fragment>
  );
}
```