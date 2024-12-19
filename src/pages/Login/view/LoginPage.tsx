import useLoginPageViewModel from '../viewModel/useLoginPageViewModel';

const LoginPage = () => {
  const { register, handleSubmit, errors, textError, onSubmit } = useLoginPageViewModel();

  return (
    <div className="flex items-center justify-center h-screen bg-[url('/images/bg_login.png')] bg-no-repeat bg-cover">
      <div className="flex z-10 w-11/12 max-w-[68.75rem] h-5/6 max-h-[37.5rem] bg-white rounded-2xl overflow-auto shadow-lg">
        <div className="float-left w-full h-full">
          <img src="/images/mStudio_logo.png" alt="logo" className="w-full h-full object-cover" />
        </div>

        <div className="float-left w-full h-full p-[1.25rem] box-border">
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-[21.875rem] mx-auto">
            <h2 className="mb-[3rem] pt-[5rem] text-3xl font-bold text-primary-darkblue">Login</h2>
            <label htmlFor="username" className="block mt-[1.25rem] pb-[0.375rem] text-lg font-medium">
              ID
            </label>
            <input
              {...register('username')}
              id="username"
              type="text"
              className="w-full h-[3rem] px-[0.75rem] py-[0.375rem] border border-bgContent rounded-lg bg-white font-md"
            />
            <label htmlFor="password" className="block mt-[1.25rem] pb-[0.375rem] text-lg font-md">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              className="w-full h-[3rem] px-[0.75rem] py-[0.375rem] border border-bgContent rounded-lg bg-white font-md"
            />
            <p className="h-[2.75rem] pt-[0.5rem] text-error box-border">{errors.password?.message || textError}</p>
            <button
              type="submit"
              className="w-full h-[3rem] mt-[1.25rem] bg-primary-darkblue rounded-lg text-lg font-bold text-white hover:underline"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
