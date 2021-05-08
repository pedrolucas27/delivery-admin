import React from "react";
import { 
	Result,
	Button
} from 'antd';


function NotFound(){
	return(
		<div>
			 <Result
			    status="404"
			    title="404"
			    subTitle="Desculpa, essa página que você visitou não existe."
			    extra={<Button shape="round" className="button">Voltar para a página inicial</Button>}
  			/>
		</div>
	);
}

export default NotFound;