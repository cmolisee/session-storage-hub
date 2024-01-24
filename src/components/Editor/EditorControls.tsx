
interface IEditorControls {
    saveCallback: () => void;
    cancelCallback: () => void;
}

const EditorControls = ({ saveCallback, cancelCallback }: IEditorControls) => {

    return (
        <div id={'EditorControls'} className={'flex justify-end'}>
            {/* checkmark */}
            <svg onClick={saveCallback} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke-width={'1.5'} stroke={'currentColor'} className={'mx-4 w-6 h-6 cursor-pointer rounded-lg hover:bg-green-300'}>
                <path stroke-linecap='round' stroke-linejoin='round' d='m4.5 12.75 6 6 9-13.5' />
            </svg>
            {/* x-mark */}
            <svg onClick={cancelCallback} xmlns={'http://www.w3.org/2000/svg'} fill={'none'} viewBox={'0 0 24 24'} stroke-width={'1.5'} stroke={'currentColor'} className={'mx-4 w-6 h-6 cursor-pointer rounded-lg hover:bg-red-300'}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
        </div>
    );
}

export default EditorControls;