import { PartyPopper } from 'lucide-react'
const Items = () => {
    return (
        <div className='bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow'>
            <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <img src="https://images.unsplash.com/photo-1630395822970-acd6a691d97e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFBhcnR5fGVufDB8fDB8fHww " alt="" className='w-full h-full object-cover rounded-full  scale-150' />
                {/* <span className='text-3xl'><PartyPopper /></span> */}
            </div>
            <h3 className='text-xl font-semibold text-gray-800 mb-3'>
                Birthday Party
            </h3>
            <p className='text-gray-600 leading-relaxed'>
                We have successfully organized various events, Birthday Party and  providing exceptional catering services to our clients.
            </p>
        </div>
    )
}

export default Items