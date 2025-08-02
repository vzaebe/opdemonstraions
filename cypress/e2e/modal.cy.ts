describe('Modal Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should open member modal when clicking on team member', () => {
    // Переходим к секции команды
    cy.get('[data-testid="team-section"]').scrollIntoView()

    // Кликаем на первого участника команды
    cy.get('[data-testid="team-member"]').first().click()

    // Проверяем, что модальное окно открылось
    cy.get('[role="dialog"]').should('be.visible')
    cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true')

    // Проверяем содержимое модального окна
    cy.get('[role="dialog"]').within(() => {
      cy.get('.modal-name').should('be.visible')
      cy.get('.modal-role').should('be.visible')
      cy.get('.modal-photo').should('be.visible')
      cy.get('.bio-text').should('be.visible')
    })
  })

  it('should close modal when clicking close button', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()
    cy.get('[role="dialog"]').should('be.visible')

    // Кликаем на кнопку закрытия
    cy.get('.close-btn').click()

    // Проверяем, что модальное окно закрылось
    cy.get('[role="dialog"]').should('not.exist')
  })

  it('should close modal when clicking outside', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()
    cy.get('[role="dialog"]').should('be.visible')

    // Кликаем вне модального окна
    cy.get('.modal-bg').click({ force: true })

    // Проверяем, что модальное окно закрылось
    cy.get('[role="dialog"]').should('not.exist')
  })

  it('should close modal when pressing Escape key', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()
    cy.get('[role="dialog"]').should('be.visible')

    // Нажимаем Escape
    cy.get('body').type('{esc}')

    // Проверяем, что модальное окно закрылось
    cy.get('[role="dialog"]').should('not.exist')
  })

  it('should maintain focus trap inside modal', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()
    cy.get('[role="dialog"]').should('be.visible')

    // Проверяем, что фокус находится внутри модального окна
    cy.get('[role="dialog"]').should('be.focused')

    // Нажимаем Tab несколько раз
    cy.get('body').type('{tab}')
    cy.get('body').type('{tab}')
    cy.get('body').type('{tab}')

    // Проверяем, что фокус остается внутри модального окна
    cy.get('[role="dialog"]').should('be.focused')
  })

  it('should display correct member information', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()

    // Проверяем, что информация отображается корректно
    cy.get('[role="dialog"]').within(() => {
      cy.get('.modal-name').should('not.be.empty')
      cy.get('.modal-role').should('not.be.empty')
      cy.get('.modal-photo').should('have.attr', 'src')
      cy.get('.bio-text').should('not.be.empty')
    })
  })

  it('should have proper accessibility attributes', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()

    // Проверяем accessibility атрибуты
    cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true')
    cy.get('[role="dialog"]').should('have.attr', 'aria-labelledby')
    cy.get('.close-btn').should('have.attr', 'aria-label')
  })

  it('should work with keyboard navigation', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()

        // Навигация с помощью клавиатуры
    cy.get('body').type('{tab}')
    cy.get('body').type('{tab}')
    cy.get('body').type('{tab}')

    // Проверяем, что можем закрыть модальное окно с помощью Enter
    cy.get('.close-btn').focus()
    cy.get('.close-btn').type('{enter}')
    cy.get('[role="dialog"]').should('not.exist')
  })

  it('should handle multiple modal opens and closes', () => {
    // Открываем модальное окно несколько раз
    for (let i = 0; i < 3; i++) {
      cy.get('[data-testid="team-member"]').first().click()
      cy.get('[role="dialog"]').should('be.visible')
      cy.get('.close-btn').click()
      cy.get('[role="dialog"]').should('not.exist')
    }
  })

  it('should display contact links correctly', () => {
    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()

    // Проверяем наличие контактных ссылок
    cy.get('[role="dialog"]').within(() => {
      cy.get('.contact-links').should('be.visible')
      cy.get('.contact-link').should('have.length.at.least', 1)
    })
  })

  it('should be responsive on mobile devices', () => {
    // Устанавливаем размер экрана для мобильного устройства
    cy.viewport('iphone-6')

    // Открываем модальное окно
    cy.get('[data-testid="team-member"]').first().click()
    cy.get('[role="dialog"]').should('be.visible')

    // Проверяем, что модальное окно адаптировано для мобильных устройств
    cy.get('.modal-content').should('be.visible')
    cy.get('.modal-photo').should('be.visible')
  })
})
