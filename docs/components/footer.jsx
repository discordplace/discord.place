export default function Footer() {
  return (
    <div className="px-4 py-3.5 mt-auto border-t lg:px-0 bg-secondary border-t-primary">
      <div className="flex flex-wrap items-center justify-center max-w-3xl mx-auto text-xs gap-y-2 sm:justify-between text-tertiary">
        <div>
          Copyright © <span className="text-secondary">discord.place</span>, {new Date().getFullYear()}. GPL v3 Licensed.
        </div>

        <div>
          Thanks to{' '}
          <span className="cursor-pointer text-secondary hover:text-purple-400 hover:underline underline-offset-3">Nodesty</span>{' '}
          for supporting this project.
        </div>
      </div>
    </div>
  );
}