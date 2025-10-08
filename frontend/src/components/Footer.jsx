import logo from '../assets/logo.png'
import image1 from '../assets/facebook.png'
import image2 from '../assets/instagram.png'
import image3 from '../assets/phone.png'
const Footer = () => {
  return (
    <>
      {/* Main footer content */}
      <footer class="p-4 bg-white md:p-8 lg:p-10 dark:bg-gray-800">
  <div class="mx-auto max-w-screen-xl text-center">
      <a href="#" class="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white">
           <div className="w-[100px] h-10 flex items-center justify-center 
                          sm:w-[120px] 
                          xs:w-[10px]">
            <img src={logo} alt="logo" />
          </div>
          
      </a>
      <p class="my-6 text-gray-500 dark:text-gray-400">Our goal is to make our school cleaner, safer, and more efficient for everyone.</p>
      <ul class="media flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
          
          <li>
              <a href="tel:+1234567890" class=" mr-4 hover:underline md:mr-6"><img src={image3} alt="Facebook" className="w-6 h-6 object-contain" /></a>
             
          </li>
         <li>
             <a href="https://facebook.com" class="mr-4 hover:underline md:mr-6"><img src={image1} alt="Facebook" className="w-6 h-6 object-contain" /></a>
          </li>
          <li>
             <a href="https://instagram.com" class="mr-4 hover:underline md:mr-6"><img src={image2} alt="Facebook" className="w-6 h-6 object-contain" /></a>
          </li>
      </ul>
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="#" class="hover:underline">ProjectClean™</a>. All Rights Reserved.</span>
  </div>
</footer>
    </>
  );
};

export default Footer;