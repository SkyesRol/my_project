import styles from './Coze.module.css'
import {
    useRef,
    useState
} from 'react'
const Coze = () => {
    const patToken = import.meta.env.VITE_PAT_TOKEN;
    const uploadUrl = 'https://api.coze.cn/v1/files/upload';
    const workflowUrl = 'https://api.coze.cn/v1/workflow/run';
    const workflow_id = '7544203121025007650';



    const uploadImageRef = useRef(null)
    const [imgPreview, setImgPreview] = useState('https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png');
    const [desc, setDesc] = useState('')
    const [musicUrl, setMusicUrl] = useState('');
    const [status, setStatus] = useState('');
    const updateImageData = () => {
        const input = uploadImageRef.current;
        // console.log(uploadImageRef.current)
        if (!input.files || input.files.length === 0) { return; }
        const file = input.files[0];
        // console.log(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            // 转换为base64格式图片
            setImgPreview(e.target?.result)
            // imgPreview.value = e.target?.result as string; 
        };
    }
    const uploadFile = async () => {
        // 请求体对象
        const formData = new FormData();
        const input = uploadImageRef.current;
        if (!input.files || input.files.length <= 0) return;
        // 图像是个二进制文件
        // 文件就用formdata对象传递
        formData.append('file', input.files[0]);

        const res = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${patToken}`, },
            body: formData,
        });

        const ret = await res.json();

        if (ret.code !== 0) { status.value = ret.msg; return; }
        console.log(ret, 'from upload procedure');

        return ret.data.id;
    }

    const generate = async () => {
        setStatus("图片上传中...");
        const file_id = await uploadFile();
        console.log(file_id);
        if (!file_id) return;
        setStatus("图片上传成功，正在生成...")
        const parameters = {
            // 图片需要id
            pic: JSON.stringify({ file_id }),
            desc: desc
        };
        console.log(parameters);

        const res = await fetch(workflowUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${patToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workflow_id, parameters }),


        });
        const ret = await res.json();
        ret.data = JSON.parse(ret.data);
        console.log(ret, 'from generate procedure');

        setStatus("生成成功");
        setMusicUrl(ret.data.Url);
        setDesc('');
        setImgPreview('https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png');
    }



    return (
        <div className={styles.container}>
            <div className={styles.input}>
                <div className={styles.fileInput}>
                    <input
                        ref={uploadImageRef}
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        required
                        onChange={updateImageData}
                    />
                </div>
                <img
                    src={imgPreview}
                    alt="preview"
                    className={styles.preview}

                />
                <div className={styles.settings}>
                    <div className={styles.selection}>
                        <label>描述:</label>
                        <input value={desc} type="text" onChange={(event) => setDesc(event.target.value)} />
                    </div>
                </div>

                <div className={styles.generate}>
                    <button onClick={generate}>生成</button>
                </div>
            </div>
            <div className={styles.output}>
                <div className={styles.generated}>
                    {musicUrl && <audio src={musicUrl} controls></audio>}
                    {status && <div className={styles.status}>{status}</div>}
                </div>
            </div>

        </div>
    )


}

export default Coze