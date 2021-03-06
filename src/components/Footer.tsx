import logo from '../../images/kryptonite.svg'

const Footer = () => {
    return (
        <div className='w-full flex md:justify-center justify-between items-center flex-col p-4 gradient-bg-footer'>
            <div className="flex w-full sm:flex-row flex-col justify-between items-center my-4">
                <div className="flex flex-[0.5] justify-center items-center">
                    <a href="https://www.aurelientrouble.com"><img src={logo} alt="Logo" className="w-[50vw] md:w-[20vw]" /></a>
                </div>
                <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full">
                    <p className="text-white text-base text-center mx-2 cursor-pointer">Market</p>
                    <p className="text-white text-base text-center mx-2 cursor-pointer">Exchange</p>
                    <p className="text-white text-base text-center mx-2 cursor-pointer">Tutoriels</p>
                    <p className="text-white text-base text-center mx-2 cursor-pointer">Wallet</p>
                </div>
            </div>
            <div className="flex justify-center items-center flex-col mt-5">
                <p className="text-white text-sm text-center">Contactez-nous</p>
                <p className="text-white text-sm text-center"><a href="https://www.aurelientrouble.com">info@kryptonite.com</a></p>
            </div>
            <div className="w-full sm:w-[90%] h-[0.25px] bg-gray-400 mt-5" />
            <div className="w-full sm:w-[90%] flex justify-between items-center mt-3">
                <p className="text-white text-sm text-center">@ Cryptonite 2022</p>
                <p className="text-white text-sm text-center">Tous droits réservés</p>
            </div>
        </div>
    )
}

export default Footer