import { useLayoutHooks } from "../../hooks/useNavigations";

const MobileTabletDrawerBackDrop = () => {
  let { closeNavigation } = useLayoutHooks();
  return (
    <div>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={closeNavigation}
        className="
            fixed inset-0 z-40
            bg-slate-950/35
            backdrop-blur-[2px]
            lg:hidden
          "
      />
    </div>
  );
};

export default MobileTabletDrawerBackDrop;
