---
trigger: always_on
---

# Prioritize Static Rendering and Selective Hydration

## 1\. Core Principle

To enforce Astro's "zero-JS by default" philosophy by ensuring that interactive components (like React) are used only when necessary and are hydrated using the most performant strategy possible.

## 2\. Rationale

Astro's primary performance benefit comes from shipping a minimal amount of JavaScript. React components, when hydrated, add to this JavaScript payload. This rule prevents developers from negating Astro's benefits by carelessly making everything interactive. By enforcing thoughtful hydration, we ensure faster page loads (First Contentful Paint & Time to Interactive), better Lighthouse scores, and a smoother user experience.

## 3\. Guidelines

### A. Default to Astro Components for Static Content

**FAIL** if a React component (`.jsx`/`.tsx`) is used for content that has no state, event listeners, or lifecycle hooks. Such components should be refactored into native `.astro` components.

**❌ Bad:** Creating a React component just for static markup.

```jsx
// src/components/StaticCard.jsx
export default function StaticCard({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
```

```astro
// src/pages/index.astro
import StaticCard from '../components/StaticCard.jsx';
---
<StaticCard title="Hello World">This card is static.</StaticCard>
```

**✅ Good:** Using a native `.astro` component for all static content.

```astro
---
const { title } = Astro.props;
---
<div class="card">
  <h2>{title}</h2>
  <p><slot /></p>
</div>
```

```astro
// src/pages/index.astro
import StaticCard from '../components/StaticCard.astro';
---
<StaticCard title="Hello World">This card is static.</StaticCard>
```

### B. Mandate Efficient Hydration Directives

**FAIL** if a React component is used without a `client:*` directive. If it needs to be a React component, it must be explicitly marked for hydration.

**WARN** heavily on the use of `client:load`. It should only be used for immediately visible and critical interactive elements (e.g., a site header).

**RECOMMEND** `client:visible` for components below the fold and `client:idle` for low-priority components that are visible on load.

**❌ Bad:** Using the most expensive hydration strategy for a component that isn't immediately critical.

```astro
---
import NewsletterSignup from '../components/NewsletterSignup.jsx';
---
<footer>
  <NewsletterSignup client:load />
</footer>
```

**✅ Good:** Using the most efficient hydration strategy based on the component's location and priority.

```astro
---
import NewsletterSignup from '../components/NewsletterSignup.jsx';
---
<footer>
  <NewsletterSignup client:visible />
</footer>
```

### C. Offload Data Fetching to the Server

**FAIL** if an interactive React component fetches initial page data on the client side (e.g., in a `useEffect` hook). Initial data should always be fetched within the Astro page's frontmatter and passed down as props. This ensures the data is available at build-time or on the server (in SSR mode), resulting in instant rendering of content.

**❌ Bad:** Fetching data inside the component, forcing the client to wait for a loading spinner.

```jsx
// src/components/ProductList.jsx
import { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // This runs in the user's browser, after the initial page load.
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    // Users will see a loading state here first.
  );
}
```

**✅ Good:** Fetching data on the server and passing it as props. The component renders instantly with data.

```astro
---
// src/pages/products.astro
import ProductList from '../components/ProductList.jsx';

// Data is fetched on the server during the page render.
const response = await fetch('http://localhost:4321/api/products');
const products = await response.json();
---

<ProductList products={products} client:idle />
```

```jsx
// src/components/ProductList.jsx
// No useEffect for initial data fetching!
export default function ProductList({ products }) {
  // Component can now have state for filtering, etc.
  // but it renders instantly with the initial `products` data.
  return (
    <ul>
      {products.map(p => <li>{p.name}</li>)}
    </ul>
  );
}
```