const urlMain = new URL(window.location.href);
const kategoriSearch = urlMain.searchParams.get('kategori');

async function get_categories() {
  const data = await fetch('../db.json')
  return data.json()
}

async function create_categories(categories) {
  return new Promise(async(resolve, reject) => {
    try {
      const dataHolder = document.querySelector('.dataHolder')

      for (let category in categories) {  
        const category_div = document.createElement('div')
        category_div.classList.add('category')
  
        const ribbon = document.createElement('div')
        ribbon.classList.add('ribbon')
  
        const ribbon_text = document.createElement('div')
        ribbon_text.classList.add('text')
        ribbon_text.innerText = category
  
        const hold_gridHolder = document.createElement('div')
        hold_gridHolder.classList.add('hold_gridHolder')

        const gridHolder = document.createElement('div')
        gridHolder.classList.add('gridHolder')
  
        dataHolder.appendChild(category_div)
        category_div.appendChild(ribbon)
        ribbon.appendChild(ribbon_text)
        category_div.appendChild(hold_gridHolder)
        hold_gridHolder.appendChild(gridHolder)
        
        await get_websites(categories[category], gridHolder)
      }

      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

async function get_websites(category, gridHolder) {
  return new Promise(async(resolve, reject) => {
    try {
      for (const website in category.websites) {    
        const website_div = document.createElement('div')
        website_div.classList.add('gridItem')
    
        const website_div_img_holder = document.createElement('div')
        website_div_img_holder.classList.add('img_holder')

        const website_img = document.createElement('img')
        website_img.src = category.websites[website].mainImg
        website_img.setAttribute('loading', 'lazy')
    
        const website_ribbon = document.createElement('div')
        website_ribbon.classList.add('ribbon_text')

        const website_ribbon_text = document.createElement('div')
        website_ribbon_text.classList.add('text')
        website_ribbon_text.innerText = website
        
        const priceList = document.createElement('div')
        priceList.classList.add(`${Object.values(category.websites[website])[0]}`)

        website_ribbon.appendChild(website_ribbon_text)
        website_ribbon.appendChild(priceList)

        const imageHolder = document.createElement('div')
        imageHolder.classList.add('imageHolder')
    
        gridHolder.appendChild(website_div)
        website_div.appendChild(website_div_img_holder)
        website_div_img_holder.appendChild(website_img)
        website_div.appendChild(website_ribbon)
        website_div.appendChild(imageHolder)

        // Add touch event to the image
        website_img.addEventListeners('click', () => {
          getfull_screen(category.websites[website].mainImg)
        });

        // Load images
        await get_images(category.websites[website].imgs, website_div);
      }

      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

async function get_images(imgs, website_div) {
  return new Promise(async(resolve, reject) => {
    try {
      const imageHolder = website_div.querySelector('.imageHolder');

      for (const img of imgs) {
        const img_div = document.createElement('div')
        img_div.classList.add('img_div')

        const img_img = document.createElement('img')
        img_img.src = img
        img_img.setAttribute('loading', 'lazy')

        imageHolder.appendChild(img_div)
        img_div.appendChild(img_img)

        // Add touch event to each image
        img_div.addEventListeners('touchstart click', () => {
          popup(img_div, imgs, img)
        })
      }

      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}

function getfull_screen(img) {
  const full_screen = document.createElement('div')
  full_screen.classList.add('full_screen')

  const full_screen_img = document.createElement('img')
  full_screen_img.src = img
  
  document.body.appendChild(full_screen)
  full_screen.appendChild(full_screen_img)

  full_screen.addEventListener('click', () => {
    full_screen.remove()
  })
}

function popup(img_div, obj_imgs, image) {
  const popup = document.createElement('div')
  popup.classList.add('popup')

  const popup_close_holder = document.createElement('div')
  popup_close_holder.classList.add('popup_close_holder')
  popup_close_holder.innerText = 'X'

  const popup_container = document.createElement('div')
  popup_container.classList.add('popup_container')

  const popup_container_img_holder = document.createElement('div')
  popup_container_img_holder.classList.add('img_holder')

  const popup_img_main = document.createElement('img')
  popup_img_main.classList.add('popup_img_main')
  popup_img_main.src = img_div.querySelector('img').src

  const popup_img_list = document.createElement('div')
  popup_img_list.classList.add('popup_img_list')

  for (const img of obj_imgs) {
    const popup_img_div = document.createElement('div')
    popup_img_div.classList.add('popup_img_div')

    const popup_img = document.createElement('img')
    popup_img.classList.add('popup_img')
    image === img ? popup_img.classList.add('active') : null
    popup_img.src = img

    popup_img_div.appendChild(popup_img)
    popup_img_list.appendChild(popup_img_div)

    // Add touch event to each image
    popup_img_div.addEventListeners('touchstart click', () => {
      [...popup_img_list.children].forEach(child => {
        child.querySelector('img').classList.remove('active')
      })

      popup_img_main.src = popup_img.src
      popup_img_div.querySelector('img').classList.add('active')
    }, false)
  }     

  popup.appendChild(popup_container)
  popup.prepend(popup_close_holder)
  popup_container.appendChild(popup_container_img_holder)
  popup_container_img_holder.appendChild(popup_img_main)
  popup_container.appendChild(popup_img_list)

  document.body.prepend(popup)

  popup_close_holder.addEventListeners('click touchstart', () => {
    popup.remove()
  })
}

get_categories().then(async (categories) => {
  await create_categories(categories)

  document.querySelector('.loading').remove();

  document.querySelector('.searchInput').addEventListener('keyup', (e) => {
    const search = e.target.value.toLowerCase()
    urlMain.searchParams.set('kategori', search)
    window.history.pushState({}, '', urlMain.href)
    searchCategory(search)
  });

  if(kategoriSearch.trim() !== '') {
    searchCategory(kategoriSearch)
    document.querySelector('.searchInput').value = kategoriSearch
  }
});

function searchCategory(search) {
  const categories = document.querySelectorAll('.category')
  const no_result_found = document.querySelector('.no_result');

  document.querySelectorAll('.no_result').length > 0 ? no_result_found.remove() : null

  for (const category of categories) {
    const category_name = category.querySelector('.ribbon .text').innerText.toLowerCase()
    if (category_name.includes(search)) {
      category.style.display = 'block'
    } else {
      category.style.display = 'none'
    }
  }
  // check if there is any category that is visible
  if (!document.querySelector('.category[style*="display: block;"]')) {
    const no_result = document.createElement('div')
    no_result.classList.add('no_result')
    no_result.innerText = 'Hittade inga resultat'
    document.querySelector('.dataHolder').appendChild(no_result)
  }    
}

///////////////////////////////////////////   don't change  ///////////////////////////////////////////////////

// Use for adding multiple event-listener to an element
Node.prototype.addEventListeners = function(eventNames, eventFunction) {
  let eventName = undefined;
  for (eventName of eventNames.split(' '))
    this.addEventListener(eventName, eventFunction);
}
