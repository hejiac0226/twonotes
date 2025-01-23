import BlockEditor from '@/components/editor/BlockEditor';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">WingNotes</h1>
        <BlockEditor />
      </div>
    </main>
  );
}
