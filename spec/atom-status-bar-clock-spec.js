'use babel';

describe('AtomStatusBarClock', () => {
  let workspaceElement;
  let activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('status-bar')
      .then(atom.packages.activatePackage('atom-status-bar-clock'));
  });

  describe('when the atom-status-bar-clock:toggle event is triggered', () => {
    it('hides and shows the view', () => {
      jasmine.attachToDOM(workspaceElement);

      waitsForPromise(() => activationPromise);

      runs(() => {
        expect(workspaceElement.querySelector('.atom-status-bar-clock')).toExist();
        const packageElement = workspaceElement.querySelector('.atom-status-bar-clock');
        expect(packageElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'atom-status-bar-clock:toggle');
        expect(packageElement).not.toBeVisible();
        atom.commands.dispatch(workspaceElement, 'atom-status-bar-clock:toggle');
        expect(packageElement).toBeVisible();
      });
    });
  });
});
