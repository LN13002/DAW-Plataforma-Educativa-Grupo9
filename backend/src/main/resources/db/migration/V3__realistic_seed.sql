-- ============================================================
-- V3: Realistic seed data
-- Replaces V2 minimal seed with a comprehensive realistic dataset.
-- All passwords are bcrypt hashes of "aprende123".
-- ============================================================

-- Clear previous seed data (cascades to all dependent tables)
TRUNCATE TABLE users, categories CASCADE;

-- ============================================================
-- USERS  (1 admin · 3 instructors · 5 students)
-- ============================================================
INSERT INTO users (first_name, last_name, email, password_hash, role, avatar_url) VALUES

  -- Admin
  ('Admin', 'System',
   'admin@aprende.ues',
   '$2b$12$LWiGpfHT3Y5mP9tD8bX6OuXxJ7ZMT4RkQ2dN1pV3sW8aK0cE5uYrA',
   'admin', NULL),

  -- Instructors
  ('Sofia',  'Ramirez',
   'sofia.ramirez@aprende.ues',
   '$2b$12$rI9TJwuRvJN.mExN5qKT8eQM4DRHKxT.UuBTONaJ5EtMk5CfBUwt6',
   'instructor', 'https://i.pravatar.cc/150?u=sofia.ramirez'),

  ('Diego', 'Martinez',
   'diego.martinez@aprende.ues',
   '$2b$12$9vX3Kp7mL4qN2cA8hR5tOeYjW1bF6sD0uI9nE7wG4kM3zQ2cX1pUo',
   'instructor', 'https://i.pravatar.cc/150?u=diego.martinez'),

  ('Ana', 'Gutierrez',
   'ana.gutierrez@aprende.ues',
   '$2b$12$hJ4mK9pL2nQ8cV5bA7xO3eWrT6sD1uY0fI8gN5kM4zQ3cX2pRoV1w',
   'instructor', 'https://i.pravatar.cc/150?u=ana.gutierrez'),

  -- Students
  ('Carlos',  'Lopez',
   'carlos.lopez@aprende.ues',
   '$2b$12$yT8nJ3kM5pL7qO2cA9xR4eWbV1sD6uI0fN9gE8wG5kM4zQ2cX1pU',
   'student', 'https://i.pravatar.cc/150?u=carlos.lopez'),

  ('Andrea', 'Torres',
   'andrea.torres@aprende.ues',
   '$2b$12$wR6mK4pJ2nQ7cV8bA5xO1eWrT3sD9uY2fI0gN8kM5zQ4cX3pRoV2',
   'student', 'https://i.pravatar.cc/150?u=andrea.torres'),

  ('Miguel', 'Hernandez',
   'miguel.hernandez@aprende.ues',
   '$2b$12$uP5mJ2kL4nQ6cV7bA3xO8eWrT2sD0uY1fI9gN7kM3zQ1cX2pRoV3',
   'student', 'https://i.pravatar.cc/150?u=miguel.hernandez'),

  ('Laura', 'Sanchez',
   'laura.sanchez@aprende.ues',
   '$2b$12$tO4mI1kJ3nQ5cV6bA2xO7eWrT1sD8uY0fI6gN5kM2zQ0cX1pRoV4',
   'student', 'https://i.pravatar.cc/150?u=laura.sanchez'),

  ('Roberto', 'Cruz',
   'roberto.cruz@aprende.ues',
   '$2b$12$sN3mH0kI2nQ4cV5bA1xO6eWrT0sD7uY9fI5gN4kM1zQ9cX0pRoV5',
   'student', 'https://i.pravatar.cc/150?u=roberto.cruz');

-- ============================================================
-- CATEGORIES  (3 root · 4 sub)
-- ============================================================
INSERT INTO categories (name, slug, description) VALUES
  ('Programming',  'programming',  'Software development and coding courses'),
  ('Design',       'design',       'Visual design, UX, and creative courses'),
  ('Data Science', 'data-science', 'Data analysis, machine learning, and statistics');

INSERT INTO categories (name, slug, description, parent_id) VALUES
  ('Frontend Development', 'frontend',
   'HTML, CSS, JavaScript, and modern frameworks',
   (SELECT id FROM categories WHERE slug = 'programming')),

  ('Backend Development', 'backend',
   'Servers, REST APIs, databases, and DevOps',
   (SELECT id FROM categories WHERE slug = 'programming')),

  ('UX / UI Design', 'ux-ui',
   'User experience research, wireframing, and prototyping',
   (SELECT id FROM categories WHERE slug = 'design')),

  ('Machine Learning', 'machine-learning',
   'ML algorithms, deep learning, and AI applications',
   (SELECT id FROM categories WHERE slug = 'data-science'));

-- ============================================================
-- COURSES  (5 published · 1 draft)
-- ============================================================
INSERT INTO courses (title, description, thumbnail_url, level, status, instructor_id, category_id) VALUES

  (
    'HTML & CSS Fundamentals',
    'Learn the building blocks of the web. Master HTML structure and CSS styling to create beautiful, responsive pages from scratch. By the end you will deploy a real portfolio site.',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'frontend')
  ),

  (
    'JavaScript from Zero to Hero',
    'Go from complete beginner to confident JS developer. Cover variables, functions, DOM manipulation, async programming, and finish with a real-world project consuming a public API.',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'frontend')
  ),

  (
    'React: Building Modern Interfaces',
    'Master React 18 with hooks, context, and React Router. Build three complete apps — a task manager, a weather dashboard, and a social feed — all connected to real APIs.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    'intermediate', 'published',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'frontend')
  ),

  (
    'Python for Data Analysis',
    'Learn Python, pandas, and Matplotlib to explore, clean, and visualize real datasets. No prior programming experience needed — start from scratch and build a complete data dashboard.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'diego.martinez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'data-science')
  ),

  (
    'UX Design Fundamentals',
    'Understand user-centered design from research to high-fidelity prototype. Practice design thinking, wireframing in Figma, and usability testing with real participants.',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    'beginner', 'published',
    (SELECT id FROM users WHERE email = 'ana.gutierrez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'ux-ui')
  ),

  (
    'REST APIs with Node.js & Express',
    'Design and build production-ready REST APIs. Cover routing, middleware, JWT authentication, input validation, error handling, and connect to a PostgreSQL database with an ORM.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    'intermediate', 'draft',
    (SELECT id FROM users WHERE email = 'sofia.ramirez@aprende.ues'),
    (SELECT id FROM categories WHERE slug = 'backend')
  );

-- ============================================================
-- MODULES
-- ============================================================

-- Course 1: HTML & CSS Fundamentals
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Introduction to HTML', 'Understand the structure of every web page.', 1, TRUE
FROM courses WHERE title = 'HTML & CSS Fundamentals';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Styling with CSS', 'Make your pages look great with selectors, the box model, Flexbox, and Grid.', 2, TRUE
FROM courses WHERE title = 'HTML & CSS Fundamentals';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Building a Real Project', 'Put everything together and ship a responsive portfolio site.', 3, TRUE
FROM courses WHERE title = 'HTML & CSS Fundamentals';

-- Course 2: JavaScript from Zero to Hero
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'JS Fundamentals', 'Variables, data types, operators, and control flow.', 1, TRUE
FROM courses WHERE title = 'JavaScript from Zero to Hero';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Working with Data', 'Arrays, objects, destructuring, and the spread operator.', 2, TRUE
FROM courses WHERE title = 'JavaScript from Zero to Hero';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'The DOM and Async JS', 'Manipulate the DOM, handle events, and fetch data from APIs.', 3, TRUE
FROM courses WHERE title = 'JavaScript from Zero to Hero';

-- Course 3: React
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'React Core Concepts', 'JSX, components, props, and state with useState.', 1, TRUE
FROM courses WHERE title = 'React: Building Modern Interfaces';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Hooks and Side Effects', 'useEffect, custom hooks, and global state with useContext.', 2, TRUE
FROM courses WHERE title = 'React: Building Modern Interfaces';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Building a Full App', 'React Router, API integration, and the final capstone project.', 3, TRUE
FROM courses WHERE title = 'React: Building Modern Interfaces';

-- Course 4: Python for Data Analysis
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Python Essentials', 'Syntax, data types, lists, dicts, functions, and modules.', 1, TRUE
FROM courses WHERE title = 'Python for Data Analysis';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Data Analysis with pandas', 'DataFrames, data cleaning, grouping, and aggregation.', 2, TRUE
FROM courses WHERE title = 'Python for Data Analysis';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Data Visualization', 'Charts with Matplotlib and Seaborn, and building a dashboard.', 3, TRUE
FROM courses WHERE title = 'Python for Data Analysis';

-- Course 5: UX Design
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Design Thinking', 'Empathy, define, ideate — the first three phases of design thinking.', 1, TRUE
FROM courses WHERE title = 'UX Design Fundamentals';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Wireframing & Prototyping', 'From paper sketches to interactive Figma prototypes.', 2, TRUE
FROM courses WHERE title = 'UX Design Fundamentals';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Usability Testing', 'Plan, run, and analyze usability tests with real users.', 3, TRUE
FROM courses WHERE title = 'UX Design Fundamentals';

-- Course 6: Node.js (DRAFT — modules not published)
INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Node.js Basics', 'The event loop, npm, and your first HTTP server.', 1, FALSE
FROM courses WHERE title = 'REST APIs with Node.js & Express';

INSERT INTO modules (course_id, title, description, position, is_published)
SELECT id, 'Express.js', 'Routing, middleware, error handling, and request validation.', 2, FALSE
FROM courses WHERE title = 'REST APIs with Node.js & Express';

-- ============================================================
-- LESSONS
-- Helper: reference a module by its course title + module title
-- ============================================================

-- ── Course 1: HTML & CSS Fundamentals ────────────────────────

-- Module: Introduction to HTML
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'How the Web Works',
       'Browsers, servers, HTTP requests — understand what happens when you visit a URL.',
       'https://www.youtube.com/embed/hJHvdBlSxug', 540, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Introduction to HTML';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Your First HTML Document',
       'Create a valid HTML5 file from scratch: doctype, head, body, and your first tags.',
       'https://www.youtube.com/embed/UB1O30fR-EE', 780, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Introduction to HTML';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Semantic HTML Elements',
       'Replace generic divs with header, nav, main, section, article, and footer.',
       'https://www.youtube.com/embed/kGW8Al_cga4', 900, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Introduction to HTML';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'HTML Forms and Inputs',
       'Build accessible forms with text, email, select, checkbox, radio, and textarea.',
       'https://www.youtube.com/embed/fNcJuPIZ2WE', 1080, 4, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Introduction to HTML';

-- Module: Styling with CSS
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'CSS Selectors and Specificity',
       'Class, ID, attribute, pseudo-class, and pseudo-element selectors — and how specificity resolves conflicts.',
       'https://www.youtube.com/embed/l1mER1bV0N0', 660, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Styling with CSS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'The Box Model',
       'Master content, padding, border, and margin. Understand box-sizing: border-box.',
       'https://www.youtube.com/embed/rIO5326FgPE', 840, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Styling with CSS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Flexbox Layout',
       'Align and distribute elements in one dimension with display:flex, gap, align-items, and justify-content.',
       'https://www.youtube.com/embed/phWxA89Dy94', 1200, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Styling with CSS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'CSS Grid Layout',
       'Build two-dimensional layouts with grid-template-columns, grid-template-rows, and grid areas.',
       'https://www.youtube.com/embed/jV8B24rSN5o', 1380, 4, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Styling with CSS';

-- Module: Building a Real Project
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Planning Your Portfolio',
       'Wireframe your layout on paper, define your color palette and typography before writing a single line of code.',
       NULL, 360, 1, 'article', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Building a Real Project';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Building the Portfolio Page',
       'Code the full portfolio live: header, hero, projects grid, and contact section.',
       'https://www.youtube.com/embed/r_hYR53r61M', 2400, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Building a Real Project';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Making It Responsive',
       'Add media queries so your portfolio looks great on mobile, tablet, and desktop.',
       'https://www.youtube.com/embed/bn-DQznsbIMk', 1080, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'HTML & CSS Fundamentals' AND m.title = 'Building a Real Project';

-- ── Course 2: JavaScript from Zero to Hero ───────────────────

-- Module: JS Fundamentals
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Variables and Data Types',
       'var vs let vs const, primitive types, typeof, and type coercion.',
       'https://www.youtube.com/embed/hdI2bqOjy3c', 780, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'JS Fundamentals';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Control Flow and Loops',
       'if/else, switch, ternary, for, while, and for...of — decide and repeat.',
       'https://www.youtube.com/embed/IsG4Xd6LlsM', 900, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'JS Fundamentals';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Functions and Scope',
       'Declarations, expressions, arrow functions, default parameters, closures, and the call stack.',
       'https://www.youtube.com/embed/gigtS_5KKas', 1080, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'JS Fundamentals';

-- Module: Working with Data
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Arrays and Array Methods',
       'map, filter, reduce, find, some, every — functional array manipulation.',
       'https://www.youtube.com/embed/R8rmfD9Y5-c', 1080, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'Working with Data';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Objects and JSON',
       'Object literals, dot vs bracket notation, methods, and JSON.parse / JSON.stringify.',
       'https://www.youtube.com/embed/_5jdE6imZ9o', 960, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'Working with Data';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Destructuring and Spread',
       'Unpack arrays and objects, use rest parameters, and compose data with the spread operator.',
       'https://www.youtube.com/embed/NIq3qLaHCIs', 840, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'Working with Data';

-- Module: The DOM and Async JS
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'DOM Selection and Manipulation',
       'querySelector, innerHTML, classList, style, createElement, and appendChild.',
       'https://www.youtube.com/embed/0ik6X4DJKCc', 1080, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'The DOM and Async JS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Events and Event Listeners',
       'addEventListener, event delegation, preventDefault, stopPropagation, and keyboard events.',
       'https://www.youtube.com/embed/XF1_MlZ5l6M', 900, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'The DOM and Async JS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Promises and Async/Await',
       'The event loop, callbacks, Promise chains, and cleaner async code with async/await.',
       'https://www.youtube.com/embed/PoRJizFvM7s', 1320, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'The DOM and Async JS';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Fetching Data with the Fetch API',
       'GET and POST requests, handling JSON responses, error handling, and building a live weather app.',
       'https://www.youtube.com/embed/cuEtnrL9-H0', 1200, 4, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'JavaScript from Zero to Hero' AND m.title = 'The DOM and Async JS';

-- ── Course 3: React ───────────────────────────────────────────

-- Module: React Core Concepts
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Why React and How It Works',
       'The virtual DOM, reconciliation, and why component-based UIs win at scale.',
       'https://www.youtube.com/embed/Tn6-PIqc4UM', 660, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'React Core Concepts';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'JSX and Your First Component',
       'Write JSX, understand the rules, create functional components, and pass props.',
       'https://www.youtube.com/embed/w7ejDZ8SWv8', 1200, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'React Core Concepts';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'State Management with useState',
       'Declare state, trigger re-renders, handle forms, and lift state up to parent components.',
       'https://www.youtube.com/embed/O6P86uwfdR0', 1500, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'React Core Concepts';

-- Module: Hooks and Side Effects
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'useEffect and the Component Lifecycle',
       'Run side effects on mount, update, and unmount — fetch data, set timers, subscribe to events.',
       'https://www.youtube.com/embed/0ZJgIjIuY7U', 1200, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'Hooks and Side Effects';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Building Custom Hooks',
       'Extract and reuse stateful logic across components with your own useFetch and useLocalStorage hooks.',
       'https://www.youtube.com/embed/6ThXsUwLWvc', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'Hooks and Side Effects';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Global State with useContext',
       'Avoid prop drilling by creating a context, a provider, and consuming it with useContext.',
       'https://www.youtube.com/embed/5LrDIWkK_Bc', 1320, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'Hooks and Side Effects';

-- Module: Building a Full App
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Client-Side Routing with React Router',
       'Define routes, use Link and NavLink, read URL params, and protect private routes.',
       'https://www.youtube.com/embed/59IXY5IDrBA', 1260, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'Building a Full App';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Connecting to a REST API',
       'Fetch, display, and paginate data from a real API. Handle loading and error states gracefully.',
       'https://www.youtube.com/embed/dtKciwk_si4', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'Building a Full App';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Capstone: Full Social Feed App',
       'Build a complete social feed with authentication, posts, likes, and comments — fully integrated with the backend.',
       'https://www.youtube.com/embed/b9eMGE7QtTk', 3600, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'React: Building Modern Interfaces' AND m.title = 'Building a Full App';

-- ── Course 4: Python for Data Analysis ───────────────────────

-- Module: Python Essentials
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Python Syntax and Data Types',
       'Strings, integers, floats, booleans, and None. Variables, print, and input.',
       'https://www.youtube.com/embed/_uQrJ0TkZlc', 960, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Python Essentials';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Lists, Tuples, and Dictionaries',
       'Create, index, slice, and iterate over Python collections. Understand mutability.',
       'https://www.youtube.com/embed/W8KRzm-HUcc', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Python Essentials';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Functions and Modules',
       'Define reusable functions, use *args and **kwargs, import from the standard library.',
       'https://www.youtube.com/embed/9Os0o3wzS_I', 900, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Python Essentials';

-- Module: Data Analysis with pandas
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Introduction to pandas DataFrames',
       'Load CSV and JSON files, inspect shape, dtypes, head, describe, and info.',
       'https://www.youtube.com/embed/vmEHCJofslg', 1260, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Data Analysis with pandas';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Cleaning and Transforming Data',
       'Handle missing values, rename columns, change dtypes, and apply custom functions.',
       'https://www.youtube.com/embed/bDhvCp3_lYw', 1500, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Data Analysis with pandas';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Grouping and Aggregation',
       'groupby, pivot tables, merge, and concat — answer real business questions from data.',
       'https://www.youtube.com/embed/Wb2Tp35dZ-I', 1200, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Data Analysis with pandas';

-- Module: Data Visualization
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Matplotlib Basics',
       'Line, bar, scatter, and histogram charts. Customize titles, axes, colors, and legends.',
       'https://www.youtube.com/embed/3Xc3CA655Y4', 960, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Data Visualization';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Beautiful Charts with Seaborn',
       'heatmaps, pair plots, violin charts, and statistical visualizations with a single line.',
       'https://www.youtube.com/embed/6GUZXDef2U0', 1080, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Data Visualization';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Capstone: Sales Analytics Dashboard',
       'Combine everything: load a real sales dataset, clean it, analyze it, and produce a full visual report.',
       'https://www.youtube.com/embed/r-uOLxNrNk8', 2100, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Python for Data Analysis' AND m.title = 'Data Visualization';

-- ── Course 5: UX Design Fundamentals ─────────────────────────

-- Module: Design Thinking
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'What is UX Design?',
       'UX vs UI, the UX design process, and why empathy is the most important design tool.',
       'https://www.youtube.com/embed/v6n1i0qojkA', 600, 1, 'video', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Design Thinking';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'User Research Methods',
       'Interviews, surveys, contextual inquiry, card sorting, and how to synthesize findings.',
       'https://www.youtube.com/embed/Ovj-ySJ0bvg', 1200, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Design Thinking';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Personas and User Journey Maps',
       'Turn raw research into personas and journey maps that the whole team can act on.',
       NULL, 480, 3, 'article', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Design Thinking';

-- Module: Wireframing & Prototyping
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Sketching and Low-Fi Wireframes',
       'Paper prototyping, Crazy 8s, and rapid ideation — fail fast before opening Figma.',
       NULL, 420, 1, 'article', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Wireframing & Prototyping';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'High-Fidelity Wireframes in Figma',
       'Master Figma frames, auto-layout, components, and design tokens to build pixel-perfect wireframes.',
       'https://www.youtube.com/embed/FTFaQWZBqQ8', 2100, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Wireframing & Prototyping';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Interactive Prototyping',
       'Link frames, add transitions, create overlays, and share a clickable prototype with stakeholders.',
       'https://www.youtube.com/embed/lTIeZ2ahEkQ', 1500, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Wireframing & Prototyping';

-- Module: Usability Testing
INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Planning a Usability Test',
       'Write a test plan, define tasks, recruit participants, and prepare your script.',
       NULL, 540, 1, 'article', TRUE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Usability Testing';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Conducting User Interviews',
       'The think-aloud protocol, note-taking, and how to avoid leading participants.',
       'https://www.youtube.com/embed/U9ZG19XTbd4', 1200, 2, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Usability Testing';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Analyzing Results and Reporting',
       'Affinity mapping, severity ratings, and presenting actionable recommendations to stakeholders.',
       'https://www.youtube.com/embed/nYCJTea5AKg', 1080, 3, 'video', FALSE, TRUE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'UX Design Fundamentals' AND m.title = 'Usability Testing';

-- ── Course 6: Node.js & Express (DRAFT — not published) ──────

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Node.js Architecture and the Event Loop',
       'Why Node is fast, how the event loop works, and when to use it.',
       'https://www.youtube.com/embed/8aGhZQkoFbQ', 840, 1, 'video', TRUE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'REST APIs with Node.js & Express' AND m.title = 'Node.js Basics';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'npm and Package Management',
       'package.json, npm install, scripts, devDependencies, and semantic versioning.',
       'https://www.youtube.com/embed/jHDhaSSKmB0', 720, 2, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'REST APIs with Node.js & Express' AND m.title = 'Node.js Basics';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Your First HTTP Server',
       'Use the built-in http module to handle GET and POST requests without any framework.',
       'https://www.youtube.com/embed/VShtPwEkDD0', 1080, 3, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'REST APIs with Node.js & Express' AND m.title = 'Node.js Basics';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Express Routing',
       'Define routes, use route parameters and query strings, and organize routes with Router.',
       'https://www.youtube.com/embed/L72fhGm1tfE', 1200, 1, 'video', TRUE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'REST APIs with Node.js & Express' AND m.title = 'Express.js';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Middleware and Error Handling',
       'Write custom middleware, use morgan and cors, and build a global error handler.',
       'https://www.youtube.com/embed/lY6icfhap2o', 960, 2, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'REST APIs with Node.js & Express' AND m.title = 'Express.js';

INSERT INTO lessons (module_id, title, description, video_url, duration_sec, position, type, is_preview, is_published)
SELECT m.id,
       'Connecting to PostgreSQL with an ORM',
       'Set up Prisma, define a schema, run migrations, and perform CRUD operations.',
       'https://www.youtube.com/embed/RebA5J-rlwg', 1500, 3, 'video', FALSE, FALSE
FROM modules m JOIN courses c ON m.course_id = c.id
WHERE c.title = 'REST APIs with Node.js & Express' AND m.title = 'Express.js';

-- ============================================================
-- ENROLLMENTS
-- ============================================================
INSERT INTO enrollments (user_id, course_id, status, progress, enrolled_at, completed_at)
VALUES
  -- Carlos: HTML&CSS completed, JS active (67%)
  (
    (SELECT id FROM users WHERE email = 'carlos.lopez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'HTML & CSS Fundamentals'),
    'completed', 100.00,
    NOW() - INTERVAL '45 days', NOW() - INTERVAL '10 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'carlos.lopez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'JavaScript from Zero to Hero'),
    'active', 66.67,
    NOW() - INTERVAL '8 days', NULL
  ),

  -- Andrea: HTML&CSS active (36%), React just started
  (
    (SELECT id FROM users WHERE email = 'andrea.torres@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'HTML & CSS Fundamentals'),
    'active', 36.36,
    NOW() - INTERVAL '20 days', NULL
  ),
  (
    (SELECT id FROM users WHERE email = 'andrea.torres@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'React: Building Modern Interfaces'),
    'active', 0.00,
    NOW() - INTERVAL '2 days', NULL
  ),

  -- Miguel: Python active (55%)
  (
    (SELECT id FROM users WHERE email = 'miguel.hernandez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'Python for Data Analysis'),
    'active', 55.56,
    NOW() - INTERVAL '30 days', NULL
  ),

  -- Laura: UX completed
  (
    (SELECT id FROM users WHERE email = 'laura.sanchez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'UX Design Fundamentals'),
    'completed', 100.00,
    NOW() - INTERVAL '60 days', NOW() - INTERVAL '5 days'
  ),

  -- Roberto: HTML&CSS active (72%), JS started
  (
    (SELECT id FROM users WHERE email = 'roberto.cruz@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'HTML & CSS Fundamentals'),
    'active', 72.73,
    NOW() - INTERVAL '25 days', NULL
  ),
  (
    (SELECT id FROM users WHERE email = 'roberto.cruz@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'JavaScript from Zero to Hero'),
    'active', 33.33,
    NOW() - INTERVAL '5 days', NULL
  );

-- ============================================================
-- LESSON PROGRESS
-- ============================================================

-- Carlos — HTML&CSS (all 11 lessons completed)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '10 days'
FROM enrollments e
JOIN courses     c  ON e.course_id  = c.id
JOIN modules     m  ON m.course_id  = c.id
JOIN lessons     l  ON l.module_id  = m.id
JOIN users       u  ON e.user_id    = u.id
WHERE u.email  = 'carlos.lopez@aprende.ues'
  AND c.title  = 'HTML & CSS Fundamentals';

-- Carlos — JavaScript (modules 1+2 fully done, module 3 lesson 1 in progress)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '3 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'carlos.lopez@aprende.ues'
  AND c.title = 'JavaScript from Zero to Hero'
  AND m.title IN ('JS Fundamentals', 'Working with Data');

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  FALSE,
  720,
  NOW() - INTERVAL '1 day'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email  = 'carlos.lopez@aprende.ues'
  AND c.title  = 'JavaScript from Zero to Hero'
  AND m.title  = 'The DOM and Async JS'
  AND l.title  = 'DOM Selection and Manipulation';

-- Andrea — HTML&CSS (module 1 all done + module 2 lesson 1 in progress)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '12 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'andrea.torres@aprende.ues'
  AND c.title = 'HTML & CSS Fundamentals'
  AND m.title = 'Introduction to HTML';

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  FALSE,
  400,
  NOW() - INTERVAL '2 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'andrea.torres@aprende.ues'
  AND c.title = 'HTML & CSS Fundamentals'
  AND m.title = 'Styling with CSS'
  AND l.title = 'CSS Selectors and Specificity';

-- Miguel — Python (modules 1+2 done, module 3 lesson 1 done)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '15 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'miguel.hernandez@aprende.ues'
  AND c.title = 'Python for Data Analysis'
  AND m.title IN ('Python Essentials', 'Data Analysis with pandas');

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '2 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'miguel.hernandez@aprende.ues'
  AND c.title = 'Python for Data Analysis'
  AND m.title = 'Data Visualization'
  AND l.title = 'Matplotlib Basics';

-- Laura — UX Design (all 9 lessons completed)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '5 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'laura.sanchez@aprende.ues'
  AND c.title = 'UX Design Fundamentals';

-- Roberto — HTML&CSS (modules 1+2 all done + module 3 lesson 1)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '8 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'roberto.cruz@aprende.ues'
  AND c.title = 'HTML & CSS Fundamentals'
  AND m.title IN ('Introduction to HTML', 'Styling with CSS');

INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '1 day'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'roberto.cruz@aprende.ues'
  AND c.title = 'HTML & CSS Fundamentals'
  AND m.title = 'Building a Real Project'
  AND l.title = 'Planning Your Portfolio';

-- Roberto — JavaScript (module 1 fully done)
INSERT INTO lesson_progress (enrollment_id, lesson_id, is_completed, seconds_watched, last_watched_at)
SELECT
  e.id,
  l.id,
  TRUE,
  l.duration_sec,
  NOW() - INTERVAL '3 days'
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN modules m ON m.course_id = c.id
JOIN lessons l ON l.module_id = m.id
JOIN users   u ON e.user_id   = u.id
WHERE u.email = 'roberto.cruz@aprende.ues'
  AND c.title = 'JavaScript from Zero to Hero'
  AND m.title = 'JS Fundamentals';

-- ============================================================
-- REVIEWS
-- ============================================================
INSERT INTO reviews (user_id, course_id, rating, body, created_at)
VALUES
  (
    (SELECT id FROM users  WHERE email = 'carlos.lopez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'HTML & CSS Fundamentals'),
    5,
    'Sofia explains everything with incredible clarity. I went from knowing nothing about HTML to deploying my own portfolio in just three weeks. The project-based approach makes every concept stick. Highly recommend to anyone starting from scratch.',
    NOW() - INTERVAL '9 days'
  ),
  (
    (SELECT id FROM users  WHERE email = 'laura.sanchez@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'UX Design Fundamentals'),
    5,
    'This course completely changed the way I think about building products. The usability testing module was an eye-opener — I had never talked to real users before. Ana is an incredible teacher and the Figma exercises are top notch.',
    NOW() - INTERVAL '4 days'
  ),
  (
    (SELECT id FROM users  WHERE email = 'roberto.cruz@aprende.ues'),
    (SELECT id FROM courses WHERE title = 'HTML & CSS Fundamentals'),
    4,
    'Really solid foundation course. The CSS Grid and Flexbox lessons are worth the price of admission alone. I would have loved a bit more content on CSS animations, but the portfolio project is genuinely impressive to show recruiters.',
    NOW() - INTERVAL '2 days'
  );

-- ============================================================
-- CERTIFICATES  (for completed enrollments)
-- ============================================================
INSERT INTO certificates (enrollment_id, code, pdf_url, issued_at)
VALUES
  (
    (SELECT e.id FROM enrollments e
       JOIN users   u ON e.user_id   = u.id
       JOIN courses c ON e.course_id = c.id
      WHERE u.email  = 'carlos.lopez@aprende.ues'
        AND c.title  = 'HTML & CSS Fundamentals'),
    'CERT-HTMLCSS-2025-CLO-001',
    'https://storage.aprende.ues/certificates/CERT-HTMLCSS-2025-CLO-001.pdf',
    NOW() - INTERVAL '10 days'
  ),
  (
    (SELECT e.id FROM enrollments e
       JOIN users   u ON e.user_id   = u.id
       JOIN courses c ON e.course_id = c.id
      WHERE u.email  = 'laura.sanchez@aprende.ues'
        AND c.title  = 'UX Design Fundamentals'),
    'CERT-UXDES-2025-LSA-001',
    'https://storage.aprende.ues/certificates/CERT-UXDES-2025-LSA-001.pdf',
    NOW() - INTERVAL '5 days'
  );
