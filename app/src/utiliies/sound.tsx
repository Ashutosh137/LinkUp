import sound from '../assets/tap.mp3';
async function Sound() {
  const audio = new Audio(sound);
  audio.play();
}
export default Sound;
