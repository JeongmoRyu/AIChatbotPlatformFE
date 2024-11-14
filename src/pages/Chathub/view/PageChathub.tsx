import tw from 'tailwind-styled-components';

const PageChathub = () => {
  return (
    <Container>
      <h2>Chathub</h2>
    </Container>
  );
};

export default PageChathub;

export const Container = tw.div`
  w-full
  h-full
  flex
  flex-col
  gap-[5rem]
  items-center
  text-black
  max-w-default
  xl:max-w-xl
  xxl:max-w-xxl
  bg-white
`;
