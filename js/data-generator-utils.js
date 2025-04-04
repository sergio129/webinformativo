// Funciones auxiliares para generación de datos
const nameGenerator = {
    consonants: 'bcdfghjklmnpqrstvwxyz',
    vowels: 'aeiou',
    nameLength: { min: 4, max: 8 },
    lastNameLength: { min: 5, max: 10 },

    generateName() {
        const length = Math.floor(Math.random() * (this.nameLength.max - this.nameLength.min + 1)) + this.nameLength.min;
        return this.generateWord(length, true);
    },

    generateLastName() {
        const length = Math.floor(Math.random() * (this.lastNameLength.max - this.lastNameLength.min + 1)) + this.lastNameLength.min;
        return this.generateWord(length, true);
    },

    generateWord(length, capitalize = false) {
        let word = '';
        let useVowel = Math.random() > 0.5;
        
        while (word.length < length) {
            const sourceChars = useVowel ? this.vowels : this.consonants;
            word += sourceChars[Math.floor(Math.random() * sourceChars.length)];
            useVowel = !useVowel;
        }

        return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    }
};

const addressGenerator = {
    streetTypes: ['Calle', 'Carrera', 'Avenida', 'Diagonal', 'Transversal'],
    citySuffixes: ['burg', 'ton', 'ville', 'city', 'land', 'berg', 'shire'],
    
    generateCity() {
        const base = nameGenerator.generateWord(Math.floor(Math.random() * 6) + 3, true);
        const useSuffix = Math.random() > 0.5;
        return useSuffix ? 
            base + this.citySuffixes[Math.floor(Math.random() * this.citySuffixes.length)] :
            base;
    },

    generateStreet() {
        const type = this.streetTypes[Math.floor(Math.random() * this.streetTypes.length)];
        const number = Math.floor(Math.random() * 150) + 1;
        return `${type} ${number}`;
    }
};

const emailGenerator = {
    domains: ['mail', 'email', 'correo', 'inbox', 'message'],
    tlds: ['com', 'net', 'org', 'co', 'io', 'tech'],
    
    generate(name) {
        const domain = this.domains[Math.floor(Math.random() * this.domains.length)];
        const tld = this.tlds[Math.floor(Math.random() * this.tlds.length)];
        const number = Math.floor(Math.random() * 9999);
        return `${name.toLowerCase()}${number}@${domain}.${tld}`;
    }
};

const companyGenerator = {
    prefixes: ['Tech', 'Smart', 'Digi', 'Cyber', 'Data', 'Info', 'Net', 'Web', 'Cloud', 'Soft'],
    suffixes: ['Solutions', 'Systems', 'Technologies', 'Group', 'Labs', 'Works', 'Corp', 'Inc', 'LLC', 'SA'],
    
    generate() {
        const prefix = this.prefixes[Math.floor(Math.random() * this.prefixes.length)];
        const suffix = this.suffixes[Math.floor(Math.random() * this.suffixes.length)];
        const middle = Math.random() > 0.5 ? nameGenerator.generateWord(4, true) : '';
        return `${prefix}${middle}${suffix}`;
    }
};

export {
    nameGenerator,
    addressGenerator,
    emailGenerator,
    companyGenerator
};
