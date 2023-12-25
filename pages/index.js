  import dynamic from 'next/dynamic';

const Keyboard = dynamic(import('@/components/Keyboard'));

export default function Home() {
  return <Keyboard />;
}
