export const createEntryPoint = () => `import { modExCore } from 'modexpedite';
import './modexpedite.config';

// All your code goes here!

modExCore.getInstance().build(); // Command to start the build process
`;
