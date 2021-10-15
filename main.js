const containerPrincipal = document.querySelector("#accordion");
const url = "http://localhost:3000/";
const endpoint_apartamentos = "apartamentos";
const localdata = "./data.json"

const getData = (resource) => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();

		request.addEventListener("readystatechange", (e) => {
			//console.log(request, request.readyState, e);
			if (request.readyState === 4 && request.status === 200) {
				const data = JSON.parse(request.responseText);
				resolve(data);
			} else if (request.readyState === 4) {
				reject("could not fetch data");
			}
		});

		request.open("GET", resource);
		request.send();
	});
};

const getCarouselHtml = (apto) => {

	const getCarouselIndicatorHtml = (images, idCarousel) => {
		let resultHtml = '<div class="carousel-indicators">';
		images?.forEach((image, index) => {
			resultHtml = resultHtml + `<button type="button" data-bs-target="#${idCarousel}" data-bs-slide-to="${index}" 
					${index === 0 ? "class=\"active\" aria-current=\"true\"" : ""}  aria-label="${image.descricao}"></button>`;
		});
		resultHtml = resultHtml + '</div>';
		return resultHtml;
	};

	const getCarouselInnerHtml = (images) => {
		let resultHtml = '<div class="carousel-inner">';
		images?.forEach((image, index) => {
			resultHtml = resultHtml + `
				<div class="carousel-item ${index === 0 ? "active" : ""}">
					<img src="${image.url}" class="d-block w-100" alt="${image.descricao}" />
					<div class="carousel-caption d-block">
						<h5>${image.descricao}</h5>
					</div>					
				</div>`;
		});
		resultHtml = resultHtml + '</div>';
		return resultHtml;
	};

	const getCarouselButtonsHtml = (carouselId) => {
		return `
		<button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Anterior</span>
		</button>
		<button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Próximo</span>
		</button>
		`;
	};

	const carouselId = 'carousel_id_' + apto.id;
	const carouselIndicatorsHtml = getCarouselIndicatorHtml(apto.imagens, carouselId);
	const carouselInnerHtml = getCarouselInnerHtml(apto.imagens, carouselId);
	const carouselButtons = getCarouselButtonsHtml(carouselId);
	return `
		<!-- Início carrossel -->
			<div id="${carouselId}" class="carousel slide container-carousel" data-bs-ride="carousel" data-bs-interval="false">
				${carouselIndicatorsHtml}
				${carouselInnerHtml}
				${carouselButtons}
			</div>
		<!-- Fim carrossel -->
	`
}

const getInfosHtmlListGroup = (apto) => {
	let resultHtml = '<ul class="list-group list-group-flush">';
	resultHtml = resultHtml + apto.informacoes?.map((informacao) => {
		return `<li class="list-group-item">${informacao}</li>`;
	}).join("");
	resultHtml = resultHtml + '</ul>';
	return resultHtml;
};

const getInfosHtmlFlex = (apto) => {
	let resultHtml = '<div class="d-flex flex-wrap">';
	resultHtml = resultHtml + apto.informacoes?.map((informacao) => {
		return `<div class="p-1 m-1 border border-info rounded-1">${informacao}</div>`;
	}).join("");
	resultHtml = resultHtml + '</div>';
	return resultHtml;
};

const getCardTitleHtml = (apto) => {
	//return apto.endereco;
	return `
	<h5 class="card-title">
		<i class="fas fa-map-marked-alt"></i>
		<span>${apto.endereco} ${apto.complemento_endereco}</span>
	</h5>`;
};

const getCardHeaderHtml = (apto, index) => {
	return `
		<div class="card-header bg-dark text-light" id="heading_id_${apto.id}">
			<h5 class="mb-0">
				<div class="row">
					<div class="col-lg-8">
						<button class="btn btn-outline-secondary text-light mb-2 mb-lg-0 w-100" data-bs-toggle="collapse" data-bs-target="#collapse_id_${apto.id}" aria-expanded="${index === -10 ? "true" : "false"}" aria-controls="collapse_id_${apto.id}">
							${apto.cabecalho}
						</button>
					</div>
					<div class="col-6 col-lg-2">
						<i class="fas fa-ruler-combined"></i>
						<span>${apto.area_privativa?.toLocaleString()} m&sup2;</span> 
					</div>
					<div class="col-6 col-lg-2">
						<i class="fas fa-dollar-sign"></i>
						<span>${apto.preco?.toLocaleString()}</span> 
					</div>
				</div>
			</h5>
				
		</div>
	`;
};

const getContatosHtml = (apto) => {
	let resultHtml = '<ul class="list-group my-1">';
	apto.contatos?.forEach((contato) => {
		resultHtml = resultHtml +
			`
			<li class="list-group-item"> 
				<div class="d-flex flex-row align-items-center">
					<div class="me-2">
						<i class="fas fa-2x ${contato.fa_icone} "></i>
					</div>
					<div>
						<div class="fw-bold">
							${contato.nome}
						</div>
						<span>${contato.telefone}</span>
						<span class="text-muted">${contato.observacao}</span>
					</div>
				</div>
			</li>`;
	});
	resultHtml = resultHtml + '</ul>';
	return resultHtml
}
const getCardBodyHtml = (apto, index) => {
	return `
	<div id="collapse_id_${apto.id}" class="collapse ${index === -10 ? "show" : ""}" aria-labelledby="heading_id_${apto.id}" data-parent="#accordion">
		<div class="card-body">
			${getCardTitleHtml(apto)}
			<div class="row">
				<div class="col pt-2">
					${getCarouselHtml(apto)}
				</div>
				<div class="col-lg-3 pt-2">
					<i class="fas fa-building"></i> ${apto.imobiliaria}
					<a href="${apto.url_anuncio}" target="_blank" class="btn btn-outline-primary d-block"><i class="bi bi-globe"></i> Anúncio Original</a>
					${getContatosHtml(apto)}
				</div>
			</div>
			<div class="card-text">
				${getInfosHtmlListGroup(apto)}
			</div>
		</div>
	</div>
	`;
};
const addCard = (apto, index) => {
	const novoCardHtml = `
	<div class="card my-3">
		${getCardHeaderHtml(apto, index)}
		${getCardBodyHtml(apto, index)}
	</div>`;
	containerPrincipal.innerHTML = containerPrincipal.innerHTML + novoCardHtml;
};

//Busca os dados e para cada apartamento adiciona o card.
getData(localdata)
	.then((data) => {
		data.forEach((apto, index) => {
			addCard(apto, index);
		});
		console.log(data);
	})
	.catch((error) => {
		console.log("Deu erro: " + error);
	});

